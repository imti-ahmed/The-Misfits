import { NextRequest, NextResponse } from 'next/server';
import { getSites } from '@/lib/sites';
import { withRef } from '@/lib/ref';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; direction: string }> }
) {
  const { slug, direction } = await params;
  const sites = getSites().filter(s => s.url);

  const home = new URL('/', req.url).toString();

  if (sites.length === 0) return NextResponse.redirect(home);

  const index = sites.findIndex(s => s.slug === slug);
  if (index === -1) return NextResponse.redirect(withRef(sites[0].url));

  let targetUrl: string;

  if (direction === 'next') {
    targetUrl = withRef(sites[(index + 1) % sites.length].url);
  } else if (direction === 'prev') {
    targetUrl = withRef(sites[(index - 1 + sites.length) % sites.length].url);
  } else if (direction === 'rand') {
    const others = sites.filter(s => s.slug !== slug);
    const pool = others.length > 0 ? others : sites;
    targetUrl = withRef(pool[Math.floor(Math.random() * pool.length)].url);
  } else {
    return NextResponse.redirect(home);
  }

  return NextResponse.redirect(targetUrl);
}
