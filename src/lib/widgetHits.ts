const hits = new Map<string, string>();

export function recordHit(slug: string): void {
  hits.set(slug, new Date().toISOString());
}

export function drainHits(): Record<string, string> {
  const snapshot = Object.fromEntries(hits);
  hits.clear();
  return snapshot;
}
