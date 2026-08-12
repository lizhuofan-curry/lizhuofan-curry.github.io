import Link from "next/link";
export default function NotFound() { return <main id="main-content" className="not-found"><p>404 / LOST SEED</p><h1>这一页没有长出来。</h1><p>地址可能已经改变。新的内容都整理在文章与项目索引里。</p><div><Link className="primary-action" href="/">返回首页</Link><Link className="text-action" href="/articles">浏览文章 →</Link></div></main>; }
