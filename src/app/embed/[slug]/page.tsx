import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import WidgetV2Renderer from '@/widgets/v2/WidgetV2Renderer';
import WidgetPending from '@/widgets/WidgetPending';
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE } from '@/lib/widgetV2Sizes';

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

  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    const { width, height, defaultScale } = DEFAULT_WIDGET_SIZE;
    const scale = Math.max(0.1, Math.min(5, parseFloat(scaleParam ?? String(defaultScale)) || defaultScale));
    return (
      <>
        <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
          <WidgetPending slug={slug} />
        </div>
      <script dangerouslySetInnerHTML={{ __html: `(function(){function s(){window.parent.postMessage({type:'tmg-resize',width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},'*');}if(document.readyState==='complete'){s();}else{window.addEventListener('load',s);}})();` }} />
      </>
    );
  }

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  const widgetId = data.widget ? String(data.widget).padStart(3, '0') : null;
  const sizeEntry = (widgetId ? WIDGET_SIZES[widgetId] : null) ?? DEFAULT_WIDGET_SIZE;
  const { width, height, defaultScale } = sizeEntry;
  const scale = Math.max(0.1, Math.min(5, parseFloat(scaleParam ?? String(defaultScale)) || defaultScale));

  if (!widgetId) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
          <WidgetPending slug={slug} />
        </div>
      <script dangerouslySetInnerHTML={{ __html: `(function(){function s(){window.parent.postMessage({type:'tmg-resize',width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},'*');}if(document.readyState==='complete'){s();}else{window.addEventListener('load',s);}})();` }} />
      </>
    );
  }

  return (
    <>
      <style>{`html,body{margin:0;padding:0;background:transparent;width:${Math.round(width*scale)}px;height:${Math.round(height*scale)}px;overflow:hidden;}`}</style>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
        <WidgetV2Renderer
          widgetId={widgetId}
          nickname={data.nickname || data.name || slug}
          slug={slug}
          bgColor={ensureHash(data.bgColor || '')}
          textColor={ensureHash(data.textColor || '')}
        />
      </div>
      <script dangerouslySetInnerHTML={{ __html: `(function(){function s(){window.parent.postMessage({type:'tmg-resize',width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},'*');}if(document.readyState==='complete'){s();}else{window.addEventListener('load',s);}})();` }} />
    </>
  );
}
