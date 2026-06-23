import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import WidgetRenderer from '@/widgets/WidgetRenderer';

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  if (!data.widget) notFound();

  return (
    <>
      <style>{`html, body { background: transparent !important; margin: 0; padding: 0; }`}</style>
      <WidgetRenderer
        widgetId={data.widget}
        nickname={data.nickname || data.name || slug}
        slug={slug}
        bgColor={data.bgColor || ''}
        textColor={data.textColor || ''}
      />
    </>
  );
}
