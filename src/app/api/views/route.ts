import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/db';

export async function POST() {
  try {
    const views = await incrementViews();
    return NextResponse.json({ views });
  } catch (err) {
    console.error('[views]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
