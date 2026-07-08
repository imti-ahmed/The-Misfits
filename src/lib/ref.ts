export function withRef(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('ref', 'the-misfits');
    return u.toString();
  } catch {
    return url;
  }
}
