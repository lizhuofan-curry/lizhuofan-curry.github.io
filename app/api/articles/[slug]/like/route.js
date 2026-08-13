import { getSessionFromHeaders } from "../../../../../lib/auth";
import { isDatabaseConfigured, query } from "../../../../../lib/db";

async function sessionFor(request) {
  return getSessionFromHeaders(request.headers);
}

async function result(slug, userId) {
  const { rows } = await query(`
    select count(*)::int as like_count,
           exists(select 1 from article_likes l2 join articles a2 on a2.id = l2.article_id where a2.slug = $1 and l2.user_id = $2) as liked
    from article_likes l join articles a on a.id = l.article_id where a.slug = $1
  `, [slug, userId]);
  return { liked: Boolean(rows[0]?.liked), likeCount: Number(rows[0]?.like_count || 0) };
}

export async function POST(request, { params }) {
  if (!isDatabaseConfigured()) return Response.json({ error: "点赞服务尚未配置" }, { status: 503 });
  const session = await sessionFor(request);
  if (!session) return Response.json({ error: "请先登录" }, { status: 401 });
  const { slug } = await params;
  await query(`
    insert into article_likes (article_id, user_id)
    select id, $2 from articles where slug = $1 and published_revision_id is not null
    on conflict (article_id, user_id) do nothing
  `, [slug, session.user.id]);
  return Response.json(await result(slug, session.user.id));
}

export async function DELETE(request, { params }) {
  if (!isDatabaseConfigured()) return Response.json({ error: "点赞服务尚未配置" }, { status: 503 });
  const session = await sessionFor(request);
  if (!session) return Response.json({ error: "请先登录" }, { status: 401 });
  const { slug } = await params;
  await query(`delete from article_likes where user_id = $2 and article_id = (select id from articles where slug = $1)`, [slug, session.user.id]);
  return Response.json(await result(slug, session.user.id));
}
