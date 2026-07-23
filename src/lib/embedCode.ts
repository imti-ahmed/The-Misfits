import { getEmbedIframeSize } from './widgetV2Sizes';

export function buildEmbedCode(origin: string, slug: string, widgetId: string): string {
  const { width, height } = getEmbedIframeSize(widgetId);
  return `<iframe src="${origin}/embed/${slug}" width="${width}" height="${height}" style="border:0"></iframe>`;
}
