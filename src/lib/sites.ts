import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITES_DIR = path.join(process.cwd(), 'members');

export interface Site {
  slug: string;
  name: string;
  url: string;
  tags: string[];
  email: string;
  nickname: string;
  widget: string;
  bgColor: string;
  textColor: string;
  customFont: string;
  customFontFamily: string;
  info: string;
  screenshot: string;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getSites(): Site[] {
  // The members/ folder itself won't exist once the last .md file in it is
  // removed — Git doesn't track empty directories.
  if (!fs.existsSync(SITES_DIR)) return [];

  const files = fs.readdirSync(SITES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  const epoch = Math.floor(Date.now() / (36 * 60 * 60 * 1000));

  const sites = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(SITES_DIR, filename), 'utf-8');
    const { data } = matter(raw);

    return {
      slug,
      name: data.name ?? '',
      url: data.url ?? '',
      tags: data.tags ?? [],
      email: data.email ?? '',
      nickname: data.nickname ?? '',
      widget: data.widget ?? '',
      bgColor: data.bgColor ?? '',
      textColor: data.textColor ?? '',
      customFont: data.customFont ?? '',
      customFontFamily: data.customFontFamily ?? '',
      info: data.info ?? '',
      screenshot: data.screenshot ?? '',
    };
  });

  return seededShuffle(sites, epoch);
}
