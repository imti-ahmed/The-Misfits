import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getViews(): Promise<number> {
  const rows = await sql`SELECT views FROM site_stats WHERE id = 1`;
  return Number(rows[0]?.views ?? 0);
}

export async function incrementViews(): Promise<number> {
  const rows = await sql`
    INSERT INTO site_stats (id, views) VALUES (1, 1)
    ON CONFLICT (id) DO UPDATE SET views = site_stats.views + 1
    RETURNING views
  `;
  return Number(rows[0]?.views ?? 0);
}
