import { NextRequest, NextResponse, after } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { buildEmbedCode } from "@/lib/embedCode";
import { resolveEmbedIframeSize } from "@/lib/widgetV2Sizes";

// ─── Config ───────────────────────────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO ?? "imti-ahmed/The-Misfits";
const GITHUB_BASE = process.env.GITHUB_BASE_BRANCH ?? "main";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_CDN_URL = process.env.R2_CDN_URL;

const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;

const SITE_ORIGIN = "https://themisfits.byimti.tools";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(nickname: string): string {
  return nickname.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function buildMarkdown(fields: Record<string, string | string[]>): string {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.join(", ")}]`);
    } else {
      const str = String(value);
      const needsQuotes = str.startsWith("#") || str.includes(":") || str.includes('"') || /^0\d+$/.test(str);
      lines.push(`${key}: ${needsQuotes ? `"${str.replace(/"/g, '\\"')}"` : str}`);
    }
  }
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

async function gh(path: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...((options.headers ?? {}) as Record<string, string>),
    },
  });
}

async function getBaseSha(): Promise<string> {
  const res = await gh(`/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_BASE}`);
  const data = await res.json();
  return data.object.sha;
}

async function createBranch(branch: string, sha: string): Promise<void> {
  const res = await gh(`/repos/${GITHUB_REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  });
  if (!res.ok) {
    const err = await res.json();
    // Branch already exists — not a fatal error, continue writing the file
    if (!err.message?.includes("already exists")) {
      throw new Error(`Branch creation failed: ${err.message}`);
    }
  }
}

async function putFile(branch: string, path: string, content: string, message: string): Promise<void> {
  const encoded = Buffer.from(content, "utf-8").toString("base64");

  // Check if file already exists on this branch (need SHA to update)
  let sha: string | undefined;
  const check = await gh(`/repos/${GITHUB_REPO}/contents/${path}?ref=${branch}`);
  if (check.ok) {
    const existing = await check.json();
    sha = existing.sha;
  }

  const res = await gh(`/repos/${GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: encoded, branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`File write failed: ${err.message}`);
  }
}

async function createPR(branch: string, title: string, body: string): Promise<{ url: string; number: number }> {
  const res = await gh(`/repos/${GITHUB_REPO}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, body, head: branch, base: GITHUB_BASE }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`PR creation failed: ${data.message}`);
  return { url: data.html_url as string, number: data.number as number };
}

async function updatePRBody(prNumber: number, body: string): Promise<void> {
  const res = await gh(`/repos/${GITHUB_REPO}/pulls/${prNumber}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`PR update failed: ${err.message}`);
  }
}

async function countExistingMembers(): Promise<number> {
  const res = await gh(`/repos/${GITHUB_REPO}/contents/members`);
  if (!res.ok) return 1;
  const files = await res.json();
  return Array.isArray(files)
    ? files.filter((f: { name: string }) => f.name.endsWith(".md")).length + 1
    : 1;
}

// ─── Screenshot ───────────────────────────────────────────────────────────────

async function takeScreenshot(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40_000);

    if (SCREENSHOT_API_KEY) {
      // ScreenshotOne — paid, reliable
      const endpoint = `https://api.screenshotone.com/take?access_key=${SCREENSHOT_API_KEY}&url=${encodeURIComponent(url)}&format=jpg&block_ads=true&delay=3&timeout=60&image_quality=85&viewport_width=1280&viewport_height=800`;
      console.log("[screenshot] Using ScreenshotOne");
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) { console.error("[screenshot] ScreenshotOne status:", res.status); return null; }
      const buf = Buffer.from(await res.arrayBuffer());
      console.log("[screenshot] Size:", buf.length, "bytes");
      return buf;
    }

    // Microlink — free tier, actually renders the page
    console.log("[screenshot] Using Microlink for:", url);
    const apiRes = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&waitFor=1000`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    console.log("[screenshot] Microlink status:", apiRes.status);
    if (!apiRes.ok) return null;

    const data = await apiRes.json();
    const imgUrl = data?.data?.screenshot?.url;
    console.log("[screenshot] Microlink image URL:", imgUrl);
    if (!imgUrl) return null;

    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) { console.error("[screenshot] Image fetch status:", imgRes.status); return null; }

    const buf = Buffer.from(await imgRes.arrayBuffer());
    console.log("[screenshot] Size:", buf.length, "bytes");
    return buf;
  } catch (err) {
    console.error("[screenshot] Failed:", err);
    return null;
  }
}

// ─── R2 ───────────────────────────────────────────────────────────────────────

async function uploadToR2(buffer: Buffer, key: string): Promise<string | null> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_BUCKET || !R2_CDN_URL) {
    console.warn("[r2] Skipping upload — missing env vars:", {
      R2_ACCOUNT_ID: !!R2_ACCOUNT_ID,
      R2_ACCESS_KEY: !!R2_ACCESS_KEY,
      R2_SECRET_KEY: !!R2_SECRET_KEY,
      R2_BUCKET: !!R2_BUCKET,
      R2_CDN_URL: !!R2_CDN_URL,
    });
    return null;
  }
  try {
    console.log("[r2] Uploading:", key, "to bucket:", R2_BUCKET);
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
    });
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000",
    }));
    const cdnUrl = `${R2_CDN_URL.replace(/\/$/, "")}/${key}`;
    console.log("[r2] Uploaded:", cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.error("[r2] Upload failed:", err);
    return null;
  }
}

// ─── PR body ──────────────────────────────────────────────────────────────────

function buildPRBody(opts: {
  name: string;
  nickname: string;
  url: string;
  email: string;
  widgetId: string;
  tags: string[];
  applicationNumber: number;
  screenshotUrl: string | null;
}): string {
  const lines = [
    `Hey, ${opts.nickname}`,
    ``,
    `Thanks for joining the guild. Adore you for that. Here are the details you submitted:`,
    ``,
    `| Field | Value |`,
    `|---|---|`,
    `| **Name** | ${opts.name} |`,
    `| **Nickname** | ${opts.nickname} |`,
    `| **Site** | [${opts.url}](${opts.url}) |`,
    `| **Email** | ${opts.email} |`,
    `| **Widget** | ${opts.widgetId || "—"} |`,
    `| **Tags** | ${opts.tags.join(", ") || "—"} |`,
    ``,
    `You will be contacted soon through email, once the PR is accepted. But go ahead and embed the widget.`,
    ``,
    `In case there are any queries that leads to rejection of the submission, we will let you know.`,
    ``,
  ];

  if (opts.screenshotUrl) {
    lines.push(`### Site Preview`, ``, `![${opts.name}'s site](${opts.screenshotUrl})`, ``);
  }

  lines.push(`---`, ``, `Thanks,`, `Imtiyaz Ahmed`, `The Makers Guild`);
  return lines.join("\n");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nickname, url, email, tags, bgColor, textColor, customFont, widgetId, embedWidth, embedHeight, comments } = body;

    if (!name || !nickname || !url || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
    }

    const slug = toSlug(nickname);
    const branch = `member/${slug}`;

    // Check if slug already exists on main
    const existing = await gh(`/repos/${GITHUB_REPO}/contents/members/${slug}.md?ref=${GITHUB_BASE}`);
    if (existing.ok) {
      return NextResponse.json({ error: "Username not available" }, { status: 409 });
    }

    const applicationNumber = await countExistingMembers();

    const tagList =
      typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(tags) ? tags : [];

    const hasMeasuredSize = typeof embedWidth === "number" && typeof embedHeight === "number" && embedWidth > 0 && embedHeight > 0;
    const { width: iframeWidth, height: iframeHeight } = resolveEmbedIframeSize(widgetId ?? "", embedWidth, embedHeight);

    const fields: Record<string, string | string[]> = {
      name,
      nickname,
      url,
      email,
      tags: tagList,
      bgColor: bgColor ?? "",
      textColor: textColor ?? "",
      customFont: customFont ?? "",
      widget: widgetId ?? "",
      info: comments ?? "",
      embedCode: buildEmbedCode(SITE_ORIGIN, slug, iframeWidth, iframeHeight),
    };

    // Real measured size (from the widget as actually rendered client-side
    // at signup) beats the approximate per-widget-type lookup table — stored
    // per-member so the embed page never has to guess again.
    if (hasMeasuredSize) {
      fields.embedWidth = String(embedWidth);
      fields.embedHeight = String(embedHeight);
    }

    // GitHub: branch → file → PR — no screenshot yet, so the member is live
    // and reviewable right away instead of waiting on a slow external API.
    const markdown = buildMarkdown(fields);
    const baseSha = await getBaseSha();
    await createBranch(branch, baseSha);
    await putFile(branch, `members/${slug}.md`, markdown, `Add member: ${nickname}`);

    const prBody = buildPRBody({ name, nickname, url, email, widgetId, tags: tagList, applicationNumber, screenshotUrl: null });
    const pr = await createPR(branch, `Add member: ${nickname}`, prBody);

    // Screenshot + R2 upload + updating the file and PR happen after the
    // response is sent, so the user isn't stuck waiting on a slow external API.
    after(async () => {
      try {
        const screenshot = await takeScreenshot(url);
        if (!screenshot) {
          console.warn("[apply] Screenshot returned null — skipping R2 upload");
          return;
        }

        const screenshotUrl = await uploadToR2(screenshot, `screenshots/${slug}.jpg`);
        if (!screenshotUrl) return;

        const updatedMarkdown = buildMarkdown({ ...fields, screenshot: screenshotUrl });
        await putFile(branch, `members/${slug}.md`, updatedMarkdown, `Add screenshot: ${nickname}`);

        const updatedPrBody = buildPRBody({ name, nickname, url, email, widgetId, tags: tagList, applicationNumber, screenshotUrl });
        await updatePRBody(pr.number, updatedPrBody);
      } catch (err) {
        console.error("[apply] Background screenshot step failed:", err);
      }
    });

    return NextResponse.json({ slug, applicationNumber, prUrl: pr.url });
  } catch (err) {
    console.error("[apply] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create application" },
      { status: 500 }
    );
  }
}
