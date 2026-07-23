export function buildEmbedCode(origin: string, slug: string, width: number, height: number): string {
  return `<iframe src="${origin}/embed/${slug}" width="${width}" height="${height}" style="border:0"></iframe>`;
}
