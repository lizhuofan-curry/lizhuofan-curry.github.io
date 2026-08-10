import Link from "next/link";
import { SiteFooter, SiteHeader } from "../_components/SiteHeader";

const shelves = [
  { number: "01", title: "一页阅读", type: "BOOK NOTES", copy: "一本书里留下的一句话、一个问题，或一段想继续追下去的线索。", prompt: "可以放：书名、摘记、你的理解" },
  { number: "02", title: "路过的片段", type: "CITY / PHOTO", copy: "一张照片、一段天气、一次走错路。生活不必先成为大事，才值得被记录。", prompt: "可以放：照片、地点、当时的心情" },
  { number: "03", title: "正在听", type: "SOUND / FILM", copy: "一首歌、一部电影、一段播客；记录它为什么刚好在此刻击中了你。", prompt: "可以放：链接、海报、三句话感受" },
  { number: "04", title: "半成品灵感", type: "IDEA LOG", copy: "还没有答案的念头也可以先占一个位置。让它在这里慢慢长出来。", prompt: "可以放：问题、草图、待验证的假设" },
  { number: "05", title: "技术观察", type: "LEARNING", copy: "模型、代码和产品之外，也记录那些真正改变你思考方式的小发现。", prompt: "可以放：学习笔记、报错、实验结论" },
  { number: "06", title: "给未来的自己", type: "LETTER", copy: "写给下一次出发前的自己：当时在害怕什么，又想去哪里。", prompt: "可以放：短文、目标、下一次行动" },
];

export const metadata = { title: "个人花园 — Zhuofan Li" };

export default function GardenPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero garden-hero"><p className="label">02 / PERSONAL GARDEN</p><h1>不只展示完成品，<br /><em>也收藏正在发生的事。</em></h1><p>这是个人网站，不是简历的延长线。项目、阅读、照片、音乐、生活、灵感和暂时说不清的念头，都可以在这里生长。</p></section><section className="garden-manifesto"><p className="label">WHAT BELONGS HERE</p><p>一张照片也可以是一篇文章的开始；一个未解决的问题，也可以成为未来项目的种子。</p><Link href="/notes">从技术学习笔记开始 →</Link></section><section className="garden-grid">{shelves.map((shelf) => <article key={shelf.number}><div><span>{shelf.number}</span><span>{shelf.type}</span></div><h2>{shelf.title}</h2><p>{shelf.copy}</p><small>{shelf.prompt}</small></article>)}</section><section className="garden-closing"><p className="label">AN OPEN SHELF</p><h2>留一点空白，<br /><em>给还没遇见的东西。</em></h2><p>这里的每一个格子都可以被替换、扩展和重新命名。网站会跟着你的生活一起变化。</p></section><SiteFooter /></main>; }
