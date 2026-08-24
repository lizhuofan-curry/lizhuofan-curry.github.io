import Link from "next/link";
import { siteConfig } from "../_data/site";

export function SiteFooter() {
  return <footer className="site-footer"><div><strong>学习留下痕迹，作品保留证据。</strong><p>这里收录 Zhuo 的文章、项目和仍在推进的问题。</p></div><div className="footer-links"><Link href="/articles">文章</Link><Link href="/projects">项目</Link><Link href="/saved">我的收藏</Link><Link href="/privacy">隐私说明</Link><a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${siteConfig.email}`}>邮件</a></div><small>© {new Date().getFullYear()} Zhuo. Built as a personal archive.</small></footer>;
}
