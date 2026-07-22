import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import WidgetV2Renderer from '@/widgets/v2/WidgetV2Renderer';
import WidgetPending from '@/widgets/WidgetPending';
import { recordHit } from '@/lib/widgetHits';

function ensureHash(val: string): string {
  if (!val) return '';
  return val.startsWith('#') ? val : '#' + val;
}

export default async function WidgetEmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  recordHit(slug);

  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return (
      <div data-widget-state="pending">
        <WidgetPending slug={slug} />
      </div>
    );
  }

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  const widgetId = data.widget ? String(data.widget).padStart(3, '0') : null;

  if (!widgetId) {
    return (
      <div data-widget-state="pending">
        <WidgetPending slug={slug} />
      </div>
    );
  }

  return (
    <div data-widget-state="active">
      <WidgetV2Renderer
        widgetId={widgetId}
        nickname={data.nickname || data.name || slug}
        slug={slug}
        bgColor={ensureHash(data.bgColor || '')}
        textColor={ensureHash(data.textColor || '')}
      />
    </div>
  );
}
