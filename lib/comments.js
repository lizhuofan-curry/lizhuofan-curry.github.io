import { isDatabaseConfigured, query, transaction } from "./db";

function serializeComment(row, viewerId = null) {
  return {
    id: String(row.id),
    body: row.body,
    authorName: row.author_name,
    createdAt: new Date(row.created_at).toISOString(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null,
    canManage: Boolean(viewerId && row.author_id === viewerId),
    article: row.slug ? { slug: row.slug, title: row.title } : undefined,
  };
}

export async function getPublicComments(slug, viewerId = null) {
  if (!isDatabaseConfigured()) return [];
  try {
    const { rows } = await query(`
      select c.id, c.body, c.author_name, c.author_id, c.created_at
      from article_comments c
      join articles a on a.id = c.article_id
      where a.slug = $1 and a.published_revision_id is not null and c.deleted_at is null
      order by c.created_at asc, c.id asc
    `, [slug]);
    return rows.map((row) => serializeComment(row, viewerId));
  } catch (error) {
    console.error("Unable to read article comments", error);
    return [];
  }
}

export async function createComment({ slug, authorId, authorName, body }) {
  return transaction(async (client) => {
    const article = await client.query(
      "select id from articles where slug = $1 and published_revision_id is not null limit 1",
      [slug],
    );
    const articleId = article.rows[0]?.id;
    if (!articleId) return { kind: "not_found" };

    const created = await client.query(`
      with permitted as (
        insert into comment_rate_limits (user_id, last_submitted_at)
        values ($1, now())
        on conflict (user_id) do update
          set last_submitted_at = excluded.last_submitted_at
          where comment_rate_limits.last_submitted_at <= now() - interval '60 seconds'
        returning user_id
      )
      insert into article_comments (article_id, author_id, author_name, body)
      select $2, $1, $3, $4 from permitted
      returning id, body, author_name, author_id, created_at
    `, [authorId, articleId, authorName, body]);

    return created.rows[0]
      ? { kind: "created", comment: serializeComment(created.rows[0], authorId) }
      : { kind: "rate_limited" };
  });
}

async function consumeCommentRateLimit(client, userId) {
  const { rows } = await client.query(`
    insert into comment_rate_limits (user_id, last_submitted_at)
    values ($1, now())
    on conflict (user_id) do update
      set last_submitted_at = excluded.last_submitted_at
      where comment_rate_limits.last_submitted_at <= now() - interval '60 seconds'
    returning user_id
  `, [userId]);
  return Boolean(rows[0]);
}

export async function updateOwnComment({ slug, commentId, authorId, body }) {
  return transaction(async (client) => {
    const owned = await client.query(`
      select c.id
      from article_comments c
      join articles a on a.id = c.article_id
      where c.id = $1 and a.slug = $2 and c.author_id = $3
        and c.deleted_at is null and a.published_revision_id is not null
      limit 1
      for update of c
    `, [commentId, slug, authorId]);
    if (!owned.rows[0]) return { kind: "not_found" };
    if (!await consumeCommentRateLimit(client, authorId)) return { kind: "rate_limited" };

    const { rows } = await client.query(`
      update article_comments
      set body = $2, updated_at = now()
      where id = $1 and author_id = $3 and deleted_at is null
      returning id, body, author_name, author_id, created_at
    `, [commentId, body, authorId]);
    return { kind: "updated", comment: serializeComment(rows[0], authorId) };
  });
}

export async function deleteOwnComment({ slug, commentId, authorId }) {
  const { rows } = await query(`
    update article_comments c
    set deleted_at = now(), deleted_by = $3, updated_at = now()
    from articles a
    where c.id = $1 and c.article_id = a.id and a.slug = $2
      and c.author_id = $3 and c.deleted_at is null
    returning a.slug
  `, [commentId, slug, authorId]);
  return rows[0]?.slug || null;
}

export async function deleteComment(commentId, deletedBy) {
  const { rows } = await query(`
    update article_comments c
    set deleted_at = now(), deleted_by = $2, updated_at = now()
    from articles a
    where c.id = $1 and c.article_id = a.id and c.deleted_at is null
    returning a.slug
  `, [commentId, deletedBy]);
  return rows[0]?.slug || null;
}

export async function getStudioComments() {
  if (!isDatabaseConfigured()) return [];
  const { rows } = await query(`
    select c.id, c.body, c.author_name, c.created_at, c.deleted_at, a.slug, r.title
    from article_comments c
    join articles a on a.id = c.article_id
    left join article_revisions r on r.id = a.published_revision_id
    order by c.created_at desc, c.id desc
  `);
  return rows.map(serializeComment);
}
