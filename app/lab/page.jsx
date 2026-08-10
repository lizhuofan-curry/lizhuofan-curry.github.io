import { SiteFooter, SiteHeader } from "../_components/SiteHeader";
import ArchitectureLab from "./ArchitectureLab";

export const metadata = { title: "架构实验台 — Zhuofan Li" };

export default function LabPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero lab-hero"><p className="label">03 / ARCHITECTURE LAB</p><h1>不是背结构，<br /><em>而是看见连接。</em></h1><p>在同一块画板上阅读 CNN、Inception 与 ResNet：每个模块如何传递、拼接或保留信息。</p></section><ArchitectureLab /><section className="lab-reading"><div><p className="label">READ WITH SHAPES</p><h2>结构的关键，<br />常常藏在尺寸里。</h2></div><p>看 Inception 时，先问各分支的高宽能否对齐；看 ResNet 时，先问 identity 的通道和空间尺寸能否相加。模型读懂之前，形状要先说得通。</p></section><SiteFooter /></main>; }
