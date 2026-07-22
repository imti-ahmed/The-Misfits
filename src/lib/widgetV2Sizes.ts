export interface WidgetSize {
  width: number;
  height: number;
  defaultScale: number;
}

// Approximate — derived from each widget's module.css. Good enough for embed/preview
// scaling; refine with exact rendered dimensions if pixel precision matters later.
export const WIDGET_V2_SIZES: Record<string, WidgetSize> = {
  '001': { width: 752, height: 60, defaultScale: 1 },
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
