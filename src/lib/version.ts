import fs from "fs";
import path from "path";

export function getLatestVersion(): string {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), "internal", "RELEASES.md"), "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/\|\s*(v[\d.]+)\s*\|\s*\d{4}-\d{2}-\d{2}\s*\|/);
      if (m) return m[1];
    }
  } catch {}
  return "v0.0.0";
}
