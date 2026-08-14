import { notFound } from "next/navigation";
import { ArticleEditor } from "../../../_components/ArticleEditor";
import { getStudioArticle } from "../../../../lib/content";
import { publishArticle, saveDraft } from "../../actions";

export default async function EditArticlePage({ params }) { const { id } = await params; const article = await getStudioArticle(id); if (!article) notFound(); return <main id="main-content" className="studio-page editor-page"><header><p>编辑草稿</p><h1>{article.title || "未命名文章"}</h1></header><ArticleEditor article={article} saveDraft={saveDraft} publishArticle={publishArticle} /></main>; }
