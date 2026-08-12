import Link from "next/link";
import { siteConfig } from "../_data/site";

export function SiteFooter() {
  return <footer className="site-footer"><div><strong>继续生长，持续记录。</strong><p>文章、项目，以及每次真正理解一个问题的证据。</p></div><div className="footer-links"><Link href="/articles">文章</Link><Link href="/projects">项目</Link><a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${siteConfig.email}`}>邮件</a></div><small>© {new Date().getFullYear()} Zhuofan Li · Built as a static garden</small></footer>;
}
