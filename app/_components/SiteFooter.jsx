import Link from "next/link";
import { siteConfig } from "../_data/site";

export function SiteFooter() {
  return <footer className="site-footer"><div><strong>Zhuo</strong><p>写代码，也把过程写下来。</p></div><div className="footer-links"><Link href="/articles">文章</Link><Link href="/projects">项目</Link><Link href="/about">关于</Link><a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${siteConfig.email}`}>邮件</a></div><small>© {new Date().getFullYear()} Zhuo.</small></footer>;
}
