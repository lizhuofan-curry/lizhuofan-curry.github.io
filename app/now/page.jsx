import Link from "next/link";
import { SiteFooter, SiteHeader } from "../_components/SiteHeader";

export const metadata = { title: "Now — Zhuofan Li" };

export default function NowPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero now-hero"><p className="label">04 / NOW</p><h1>我正在把学习，<br /><em>变成可追踪的作品。</em></h1><p>这页是当前关注点，不是承诺清单。它会随着实验与项目的推进持续更新。</p></section><section className="now-grid"><article><span>01</span><h2>把项目写成档案</h2><p>为每一个作品补齐问题、方法、证据边界与下一步，而不只留下一个仓库链接。</p><Link href="/projects">浏览项目档案 →</Link></article><article><span>02</span><h2>把模型读成结构</h2><p>围绕 CNN、Inception 与 ResNet，继续用代码、形状和小实验理解连接方式。</p><Link href="/lab">打开架构实验台 →</Link></article><article><span>03</span><h2>把经验留成笔记</h2><p>持续记录调试、训练与工程化过程中真正可复用的判断方式。</p><Link href="/notes">阅读学习笔记 →</Link></article></section><section className="now-signoff"><p className="label">LAST UPDATED / 2026.08</p><p>在走，也在记录。下一条线索，来自下一次真实运行。</p></section><SiteFooter /></main>; }
