import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createComment, getPublicComments } from "../../../../../lib/comments";
import { isDatabaseConfigured } from "../../../../../lib/db";
import { getCurrentViewer } from "../../../../../lib/session";
import { commentInputSchema } from "../../../../../lib/validation";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const viewer = await getCurrentViewer();
  return NextResponse.json({ comments: await getPublicComments(slug, viewer.session?.user.id) });
}

export async function POST(request, { params }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "评论服务尚未配置。" }, { status: 503 });
  }
  const viewer = await getCurrentViewer();
  if (!viewer.session) {
    return NextResponse.json({ error: "请先登录后再评论。" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = commentInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "评论内容无效。" }, { status: 400 });
  }

  const { slug } = await params;
  const authorName = String(viewer.session.user.name || "已登录读者").trim().slice(0, 80) || "已登录读者";
  const result = await createComment({
    slug,
    authorId: viewer.session.user.id,
    authorName,
    body: parsed.data.body,
  });
  if (result.kind === "not_found") {
    return NextResponse.json({ error: "这篇文章当前不能评论。" }, { status: 404 });
  }
  if (result.kind === "rate_limited") {
    return NextResponse.json({ error: "请等待一分钟后再发布下一条评论。" }, { status: 429 });
  }

  revalidatePath(`/articles/${slug}`);
  return NextResponse.json({ comment: result.comment }, { status: 201 });
}
