import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { deleteOwnComment, updateOwnComment } from "../../../../../../lib/comments";
import { isDatabaseConfigured } from "../../../../../../lib/db";
import { getCurrentViewer } from "../../../../../../lib/session";
import { commentIdSchema, commentInputSchema } from "../../../../../../lib/validation";

async function getAuthorizedCommentRequest(params) {
  if (!isDatabaseConfigured()) return { error: NextResponse.json({ error: "评论服务尚未配置。" }, { status: 503 }) };
  const viewer = await getCurrentViewer();
  if (!viewer.session) return { error: NextResponse.json({ error: "请先登录。" }, { status: 401 }) };
  const { slug, id } = await params;
  const parsedId = commentIdSchema.safeParse(id);
  if (!parsedId.success) return { error: NextResponse.json({ error: "评论编号无效。" }, { status: 400 }) };
  return { slug, commentId: parsedId.data, authorId: viewer.session.user.id };
}

export async function PATCH(request, { params }) {
  const authorized = await getAuthorizedCommentRequest(params);
  if (authorized.error) return authorized.error;
  const payload = await request.json().catch(() => null);
  const parsed = commentInputSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "评论内容无效。" }, { status: 400 });
  const result = await updateOwnComment({ ...authorized, body: parsed.data.body });
  if (result.kind === "not_found") return NextResponse.json({ error: "只能修改自己仍公开的评论。" }, { status: 404 });
  if (result.kind === "rate_limited") return NextResponse.json({ error: "请等待一分钟后再修改评论。" }, { status: 429 });
  revalidatePath(`/articles/${authorized.slug}`);
  return NextResponse.json({ comment: result.comment });
}

export async function DELETE(_request, { params }) {
  const authorized = await getAuthorizedCommentRequest(params);
  if (authorized.error) return authorized.error;
  const slug = await deleteOwnComment(authorized);
  if (!slug) return NextResponse.json({ error: "只能删除自己仍公开的评论。" }, { status: 404 });
  revalidatePath(`/articles/${slug}`);
  return NextResponse.json({ ok: true });
}
