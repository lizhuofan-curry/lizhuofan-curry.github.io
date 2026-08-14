import { StudioComments } from "../../_components/StudioComments";
import { getStudioComments } from "../../../lib/comments";
import { isDatabaseConfigured } from "../../../lib/db";

export const metadata = { title: "评论管理", robots: { index: false, follow: false } };

export default async function StudioCommentsPage() {
  const configured = isDatabaseConfigured();
  const comments = configured ? await getStudioComments() : [];
  if (!configured) return <main id="main-content" className="studio-page"><section className="setup-notice"><h1>还差云端配置</h1><p>配置 PostgreSQL 并执行评论迁移后，评论管理会在这里启用。</p></section></main>;
  return <StudioComments initialComments={comments} />;
}
