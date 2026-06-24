export interface WidgetSize {
  width: number;
  height: number;
  defaultScale: number;
}

export const WIDGET_SIZES: Record<string, WidgetSize> = {
  '001': { width: 300, height: 70,  defaultScale: 1.35 },
  '002': { width: 300, height: 70,  defaultScale: 1.35 },
  '003': { width: 300, height: 27,  defaultScale: 1.35 },
  '004': { width: 300, height: 32,  defaultScale: 1.35 },
  '005': { width: 280, height: 25,  defaultScale: 1.35 },
  '006': { width: 636, height: 48,  defaultScale: 1.0  },
  '007': { width: 300, height: 36,  defaultScale: 1.35 },
  '008': { width: 220, height: 46,  defaultScale: 1.35 },
  '009': { width: 280, height: 64,  defaultScale: 1.35 },
  '010': { width: 380, height: 30,  defaultScale: 1.35 },
  '011': { width: 300, height: 29,  defaultScale: 1.35 },
};

export const DEFAULT_WIDGET_SIZE: WidgetSize = { width: 300, height: 70, defaultScale: 1.35 };
