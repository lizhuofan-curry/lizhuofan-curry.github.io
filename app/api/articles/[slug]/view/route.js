import { createHmac } from "node:crypto";
import { engagementSessionSchema } from "../../../../../lib/validation";
import { isDatabaseConfigured, query } from "../../../../../lib/db";

export async function POST(request, { params }) {
  if (!isDatabaseConfigured() || !process.env.VIEW_HASH_SECRET) {
    return Response.json({ viewCount: 0, configured: false });
  }
  try {
    const { slug } = await params;
    const { sessionId } = engagementSessionSchema.parse(await request.json());
    const sessionHash = createHmac("sha256", process.env.VIEW_HASH_SECRET).update(sessionId).digest("hex");
    const { rows } = await query(`
      with target as (select id from articles where slug = $1 and published_revision_id is not null),
      inserted as (
        insert into article_views (article_id, session_hash)
        select id, $2 from target
        on conflict (article_id, session_hash) do nothing
        returning article_id
      )
      select count(*)::int as view_count
      from article_views
      where article_id = (select id from target)
    `, [slug, sessionHash]);
    return Response.json({ viewCount: Number(rows[0]?.view_count || 0) });
  } catch (error) {
    if (error?.name === "ZodError") return Response.json({ error: "会话标识无效" }, { status: 400 });
    console.error("View counter failed", error);
    return Response.json({ error: "暂时无法记录观看" }, { status: 500 });
  }
}
