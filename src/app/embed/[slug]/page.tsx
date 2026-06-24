import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import WidgetRenderer from '@/widgets/WidgetRenderer';
import WidgetPending from '@/widgets/WidgetPending';
import { WIDGET_SIZES, DEFAULT_WIDGET_SIZE } from '@/lib/widgetSizes';

function ensureHash(val: string): string {
  if (!val) return '';
  return val.startsWith('#') ? val : '#' + val;
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
  const scale = Math.max(0.1, Math.min(5, parseFloat(scaleParam ?? '1') || 1));

  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    const { width, height } = DEFAULT_WIDGET_SIZE;
    return (
      <>
        <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
          <WidgetPending slug={slug} />
        </div>
      </>
    );
  }

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  const widgetId = data.widget ? String(data.widget).padStart(3, '0') : null;

  if (!widgetId) {
    const { width, height } = DEFAULT_WIDGET_SIZE;
    return (
      <>
        <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
          <WidgetPending slug={slug} />
        </div>
      </>
    );
  }

  const { width, height } = WIDGET_SIZES[widgetId] ?? DEFAULT_WIDGET_SIZE;

  return (
    <>
      <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
        <WidgetRenderer
          widgetId={widgetId}
          nickname={data.nickname || data.name || slug}
          slug={slug}
          bgColor={ensureHash(data.bgColor || '')}
          textColor={ensureHash(data.textColor || '')}
        />
      </div>
    </>
  );
}
