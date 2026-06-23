export function withRef(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('ref', 'the-makers-guild');
    return u.toString();
  } catch {
    return url;
  }
}
