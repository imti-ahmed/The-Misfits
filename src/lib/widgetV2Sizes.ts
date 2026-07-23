export interface WidgetSize {
  width: number;
  height: number;
  defaultScale: number;
}

// Approximate — derived from each widget's module.css. Good enough for embed/preview
// scaling; refine with exact rendered dimensions if pixel precision matters later.
export const WIDGET_V2_SIZES: Record<string, WidgetSize> = {
  '002': { width: 256, height: 60, defaultScale: 1 },
  '003': { width: 205, height: 32, defaultScale: 1 },
  '004': { width: 217, height: 32, defaultScale: 1 },
  '005': { width: 256, height: 60, defaultScale: 1 },
  '006': { width: 217, height: 32, defaultScale: 1 },
  '007': { width: 220, height: 32, defaultScale: 1 },
  '008': { width: 169, height: 32, defaultScale: 1 },
  '009': { width: 230, height: 60, defaultScale: 1 },
};

export const DEFAULT_WIDGET_V2_SIZE: WidgetSize = { width: 256, height: 60, defaultScale: 1 };

// No breathing room around the widget — the iframe is sized to exactly the
// widget's own content box.
export const EMBED_PADDING = 0;

// Adds the iframe's (currently zero) padding around a widget's actual
// (measured or looked-up) content size.
export function embedIframeSize(contentWidth: number, contentHeight: number): { width: number; height: number } {
  return { width: Math.ceil(contentWidth) + EMBED_PADDING * 2, height: Math.ceil(contentHeight) + EMBED_PADDING };
}

// Fallback for when a member has no measured size on file yet — an
// approximation only, see the comment on WIDGET_V2_SIZES above.
export function getEmbedIframeSize(widgetId: string): { width: number; height: number } {
  const { width, height } = WIDGET_V2_SIZES[String(widgetId).padStart(3, '0')] ?? DEFAULT_WIDGET_V2_SIZE;
  return embedIframeSize(width, height);
}

// Prefers a real measured content size (taken from the widget as actually
// rendered client-side at signup) over the approximate per-widget-type table.
export function resolveEmbedIframeSize(
  widgetId: string,
  measuredWidth?: number | null,
  measuredHeight?: number | null
): { width: number; height: number } {
  if (measuredWidth && measuredWidth > 0 && measuredHeight && measuredHeight > 0) {
    return embedIframeSize(measuredWidth, measuredHeight);
  }
  return getEmbedIframeSize(widgetId);
}
