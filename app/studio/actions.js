"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/session";
import { transaction } from "../../lib/db";
import { parseArticleForm, readingMinutes } from "../../lib/validation";

async function save(formData, publish) {
  const viewer = await requireAdmin();
  if (!viewer.configured) redirect("/studio?setup=required");
  const input = parseArticleForm(formData);
  const articleId = await transaction(async (client) => {
    let id = input.id;
    if (!id) {
      const created = await client.query(`insert into articles (slug, author_id) values ($1, $2) returning id`, [input.slug, viewer.session.user.id]);
      id = created.rows[0].id;
    } else {
      await client.query(`update articles set slug = $1, updated_at = now() where id = $2`, [input.slug, id]);
    }
    const current = await client.query(`select draft_revision_id from articles where id = $1 for update`, [id]);
    const values = [input.title, input.description, input.body, input.coverUrl || null, input.tags, input.category, readingMinutes(input.body), viewer.session.user.id];
    let revisionId = current.rows[0]?.draft_revision_id;
    if (revisionId) {
      await client.query(`update article_revisions set title=$1, description=$2, body_markdown=$3, cover_url=$4, tags=$5, category=$6, reading_time_minutes=$7, created_by=$8, updated_at=now() where id=$9 and status='draft'`, [...values, revisionId]);
    } else {
      const revision = await client.query(`insert into article_revisions (article_id,title,description,body_markdown,cover_url,tags,category,reading_time_minutes,status,created_by) values ($9,$1,$2,$3,$4,$5,$6,$7,'draft',$8) returning id`, [...values, id]);
      revisionId = revision.rows[0].id;
      await client.query(`update articles set draft_revision_id=$1, updated_at=now() where id=$2`, [revisionId, id]);
    }
    if (publish) {
      await client.query(`update article_revisions set status='published', published_at=now(), updated_at=now() where id=$1`, [revisionId]);
      await client.query(`update articles set published_revision_id=$1, draft_revision_id=null, updated_at=now() where id=$2`, [revisionId, id]);
    }
    return id;
  });
  revalidatePath("/"); revalidatePath("/articles"); revalidatePath(`/articles/${input.slug}`); revalidatePath("/sitemap.xml");
  redirect(`/studio/articles/${articleId}?saved=${publish ? "published" : "draft"}`);
}

export async function saveDraft(formData) { return save(formData, false); }
export async function publishArticle(formData) { return save(formData, true); }

export async function deleteArticle(formData) {
  const viewer = await requireAdmin();
  if (!viewer.configured) redirect("/studio?setup=required");
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) redirect("/studio/articles?deleted=invalid");

  const slug = await transaction(async (client) => {
    const existing = await client.query("select slug from articles where id = $1 for update", [id]);
    if (!existing.rows[0]) return null;
    await client.query("delete from articles where id = $1", [id]);
    return existing.rows[0].slug;
  });

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/studio");
  revalidatePath("/studio/articles");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/articles/${slug}`);
  redirect("/studio/articles?deleted=1");
}
