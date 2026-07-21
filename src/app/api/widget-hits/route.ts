import { NextRequest, NextResponse } from 'next/server';
import { drainHits } from '@/lib/widgetHits';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!process.env.HITS_FLUSH_SECRET || token !== process.env.HITS_FLUSH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(drainHits());
}
