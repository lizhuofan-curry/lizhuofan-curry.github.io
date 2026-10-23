import { siteConfig } from "../_data/site";
import { Icon } from "./Icon";
export function SiteFooter() { return <footer className="site-footer"><div className="footer-inner"><div><a className="brand" href="/">zhuo<span>.</span></a><p>探索、创造，也认真生活。</p></div><div className="footer-links"><a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <Icon name="diagonal" size={14}/></a><a href={`mailto:${siteConfig.email}`}>邮件</a><a href="/privacy">隐私与说明</a></div><span className="copyright">© 2026 Zhuo</span></div></footer>; }
