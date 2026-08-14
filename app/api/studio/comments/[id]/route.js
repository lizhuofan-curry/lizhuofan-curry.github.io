import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { deleteComment } from "../../../../../lib/comments";
import { isDatabaseConfigured } from "../../../../../lib/db";
import { getCurrentViewer } from "../../../../../lib/session";
import { commentIdSchema } from "../../../../../lib/validation";

export async function DELETE(_request, { params }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "评论服务尚未配置。" }, { status: 503 });
  }
  const viewer = await getCurrentViewer();
  if (!viewer.session || viewer.role !== "admin") {
    return NextResponse.json({ error: "无权执行此操作。" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = commentIdSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "评论编号无效。" }, { status: 400 });
  }
  const slug = await deleteComment(parsed.data, viewer.session.user.id);
  if (!slug) return NextResponse.json({ error: "评论不存在或已删除。" }, { status: 404 });

  revalidatePath(`/articles/${slug}`);
  revalidatePath("/studio/comments");
  return NextResponse.json({ ok: true });
}
