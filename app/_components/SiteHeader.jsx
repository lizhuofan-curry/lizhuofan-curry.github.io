import Link from "next/link";

function GitHubMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" /></svg>;
}

export function SiteHeader() {
  return <header className="site-nav-wrap"><nav className="site-nav" aria-label="站点导航"><Link className="brand" href="/"><i />ZF / FIELD NOTES</Link><div className="site-nav-links"><Link href="/projects">项目</Link><Link href="/garden">花园</Link><Link href="/lab">实验台</Link><Link href="/museum">博物馆</Link><Link href="/map">地图</Link><Link href="/now">Now</Link></div><a className="github-link" href="https://github.com/lizhuofan-curry" target="_blank" rel="noreferrer" aria-label="访问 Zhuofan Li 的 GitHub 主页"><GitHubMark /><span>GitHub</span></a></nav></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} ZHUOFAN LI</span><span>DESIGNED AROUND CURIOSITY + EVIDENCE</span><Link href="/">HOME ↑</Link></footer>;
}
