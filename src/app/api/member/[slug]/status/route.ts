import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);
  const active = fs.existsSync(filePath);
  return NextResponse.json({ active });
}
