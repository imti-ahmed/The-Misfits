import { getSites, Site } from './sites';

export interface RingNeighbors {
  prev: Site;
  next: Site;
}

export function getRingNeighbors(slug: string): RingNeighbors | null {
  const sites = getSites();
  const index = sites.findIndex(s => s.slug === slug);
  if (index === -1) return null;

  const prev = sites[(index - 1 + sites.length) % sites.length];
  const next = sites[(index + 1) % sites.length];

  return { prev, next };
}
