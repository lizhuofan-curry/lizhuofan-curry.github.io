import { ArticleEditor } from "../../../_components/ArticleEditor";
import { publishArticle, saveDraft } from "../../actions";

export default function NewArticlePage() { return <main id="main-content" className="studio-page editor-page"><header><p>新建</p><h1>写一篇文章</h1></header><ArticleEditor saveDraft={saveDraft} publishArticle={publishArticle} /></main>; }
