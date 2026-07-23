import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import WidgetV2Renderer from '@/widgets/v2/WidgetV2Renderer';
import WidgetPending from '@/widgets/WidgetPending';
import { recordHit } from '@/lib/widgetHits';
import { parseGoogleFontFamily } from '@/lib/customFont';
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE, EMBED_PADDING } from '@/lib/widgetV2Sizes';

function ensureHash(val: string): string {
  if (!val) return '';
  return val.startsWith('#') ? val : '#' + val;
}

const RESIZE_SCRIPT = `(function(){function s(){window.parent.postMessage({type:'tmg-resize',width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},'*');}if(document.readyState==='complete'){s();}else{window.addEventListener('load',s);}})();`;

function EmbedFrame({
  width,
  height,
  scale,
  fontLink,
  fontVarStyle,
  children,
}: {
  width: number;
  height: number;
  scale: number;
  fontLink?: string;
  fontVarStyle?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);
  const pageWidth = scaledWidth + EMBED_PADDING * 2;
  const pageHeight = scaledHeight + EMBED_PADDING;

  return (
    <>
      {fontLink && <link rel="stylesheet" href={fontLink} />}
      <style>{`html,body{margin:0;padding:0;background:transparent;width:${pageWidth}px;height:${pageHeight}px;overflow:hidden;}`}</style>
      <div
        style={{
          width: pageWidth,
          height: pageHeight,
          padding: `${EMBED_PADDING}px ${EMBED_PADDING}px 0 ${EMBED_PADDING}px`,
          boxSizing: 'border-box',
          overflow: 'hidden',
          ...fontVarStyle,
        }}
      >
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: RESIZE_SCRIPT }} />
    </>
  );
}

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scale?: string }>;
}) {
  const { slug } = await params;
  const { scale: scaleParam } = await searchParams;
  recordHit(slug);

  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    const { width, height, defaultScale } = DEFAULT_WIDGET_SIZE;
    const scale = Math.max(0.1, Math.min(5, parseFloat(scaleParam ?? String(defaultScale)) || defaultScale));
    return (
      <EmbedFrame width={width} height={height} scale={scale}>
        <WidgetPending slug={slug} />
      </EmbedFrame>
    );
  }

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  const widgetId = data.widget ? String(data.widget).padStart(3, '0') : null;
  const sizeEntry = (widgetId ? WIDGET_SIZES[widgetId] : null) ?? DEFAULT_WIDGET_SIZE;
  const { defaultScale } = sizeEntry;
  // A member's measured content size (set at signup, from the actual rendered
  // widget) always wins over the approximate per-widget-type lookup table —
  // real text/font width varies per nickname and can't be guessed globally.
  const measuredWidth = Number(data.embedWidth);
  const measuredHeight = Number(data.embedHeight);
  const width = Number.isFinite(measuredWidth) && measuredWidth > 0 ? measuredWidth : sizeEntry.width;
  const height = Number.isFinite(measuredHeight) && measuredHeight > 0 ? measuredHeight : sizeEntry.height;
  const scale = Math.max(0.1, Math.min(5, parseFloat(scaleParam ?? String(defaultScale)) || defaultScale));

  if (!widgetId) {
    return (
      <EmbedFrame width={width} height={height} scale={scale}>
        <WidgetPending slug={slug} />
      </EmbedFrame>
    );
  }

  const customFont: string = data.customFont ?? '';
  const fontFamily = customFont ? parseGoogleFontFamily(customFont) : null;
  const fontVarStyle = fontFamily ? ({ '--font-chivo-mono': `"${fontFamily}", 'Chivo Mono', monospace` } as React.CSSProperties) : undefined;

  return (
    <EmbedFrame width={width} height={height} scale={scale} fontLink={customFont || undefined} fontVarStyle={fontVarStyle}>
      <WidgetV2Renderer
        widgetId={widgetId}
        nickname={data.nickname || data.name || slug}
        slug={slug}
        bgColor={ensureHash(data.bgColor || '')}
        textColor={ensureHash(data.textColor || '')}
      />
    </EmbedFrame>
  );
}
