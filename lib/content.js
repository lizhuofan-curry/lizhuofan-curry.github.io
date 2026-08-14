import { articles as fallbackArticles, getArticle as getFallbackArticle } from "../app/_data/articles";
import { isDatabaseConfigured, query } from "./db";

function normalizeRevision(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description,
    body: row.body_markdown,
    cover: row.cover_url,
    tags: row.tags || [],
    category: row.category,
    readingTime: `${row.reading_time_minutes} 分钟`,
    publishedAt: row.published_at,
    viewCount: Number(row.view_count || 0),
    likeCount: Number(row.like_count || 0),
    source: "database",
  };
}

const publishedSelect = `
  select a.id, a.slug, r.title, r.description, r.body_markdown, r.cover_url,
         r.tags, r.category, r.reading_time_minutes, r.published_at,
         (select count(*) from article_views v where v.article_id = a.id) as view_count,
         (select count(*) from article_likes l where l.article_id = a.id) as like_count
  from articles a
  join article_revisions r on r.id = a.published_revision_id
`;

export async function getPublishedArticles() {
  if (!isDatabaseConfigured()) return fallbackArticles.map((article) => ({ ...article, viewCount: 0, likeCount: 0, source: "mdx" }));
  try {
    const { rows } = await query(`${publishedSelect} order by r.published_at desc nulls last, a.id desc`);
    return rows.map(normalizeRevision);
  } catch (error) {
    console.error("Unable to read published articles", error);
    return fallbackArticles.map((article) => ({ ...article, viewCount: 0, likeCount: 0, source: "mdx" }));
  }
}

export async function getPublishedArticle(slug) {
  if (!isDatabaseConfigured()) {
    const article = getFallbackArticle(slug);
    return article ? { ...article, viewCount: 0, likeCount: 0, source: "mdx" } : null;
  }
  try {
    const { rows } = await query(`${publishedSelect} where a.slug = $1 limit 1`, [slug]);
    return rows[0] ? normalizeRevision(rows[0]) : null;
  } catch (error) {
    console.error("Unable to read published article", error);
    const article = getFallbackArticle(slug);
    return article ? { ...article, viewCount: 0, likeCount: 0, source: "mdx" } : null;
  }
}

export async function getStudioArticles() {
  if (!isDatabaseConfigured()) return [];
  const { rows } = await query(`
    select a.id, a.slug, a.updated_at,
           coalesce(d.title, p.title, '未命名文章') as title,
           case when a.published_revision_id is null then 'draft' else 'published' end as status,
           d.id as draft_revision_id, p.published_at
    from articles a
    left join article_revisions d on d.id = a.draft_revision_id
    left join article_revisions p on p.id = a.published_revision_id
    order by a.updated_at desc
  `);
  return rows;
}

export async function getStudioArticle(id) {
  if (!isDatabaseConfigured()) return null;
  const { rows } = await query(`
    select a.id, a.slug, a.draft_revision_id, a.published_revision_id,
           coalesce(d.title, p.title, '') as title,
           coalesce(d.description, p.description, '') as description,
           coalesce(d.body_markdown, p.body_markdown, '') as body_markdown,
           coalesce(d.cover_url, p.cover_url) as cover_url,
           coalesce(d.tags, p.tags, '{}') as tags,
           coalesce(d.category, p.category, '') as category
    from articles a
    left join article_revisions d on d.id = a.draft_revision_id
    left join article_revisions p on p.id = a.published_revision_id
    where a.id = $1
    limit 1
  `, [id]);
  return rows[0] || null;
}
