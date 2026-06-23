import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import WidgetRenderer from '@/widgets/WidgetRenderer';
import WidgetPending from '@/widgets/WidgetPending';

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  const baseStyle = <style>{`html, body { background: transparent !important; margin: 0; padding: 0; }`}</style>;

  if (!fs.existsSync(filePath)) {
    return (
      <>
        {baseStyle}
        <WidgetPending slug={slug} />
      </>
    );
  }

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  if (!data.widget) {
    return (
      <>
        {baseStyle}
        <WidgetPending slug={slug} />
      </>
    );
  }

  return (
    <>
      {baseStyle}
      <WidgetRenderer
        widgetId={String(data.widget).padStart(3, '0')}
        nickname={data.nickname || data.name || slug}
        slug={slug}
        bgColor={data.bgColor || ''}
        textColor={data.textColor || ''}
      />
    </>
  );
}
