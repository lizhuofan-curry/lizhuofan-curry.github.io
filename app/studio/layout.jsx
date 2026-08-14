import Link from "next/link";
import { requireAdmin } from "../../lib/session";

export const metadata = { title: "写作后台", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function StudioLayout({ children }) { const viewer = await requireAdmin(); return <div className="studio-shell"><aside className="studio-nav"><Link className="studio-brand" href="/studio">Zhuo Studio</Link><nav><Link href="/studio/articles">文章</Link><Link href="/studio/articles/new">新建文章</Link><Link href="/studio/comments">评论</Link><Link href="/studio/media">媒体</Link><Link href="/">查看网站</Link></nav><small>{viewer.configured ? viewer.session?.user.email : "等待环境配置"}</small></aside><div className="studio-content">{children}</div></div>; }
