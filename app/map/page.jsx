import { SiteFooter, SiteHeader } from "../_components/SiteHeader";
import JourneyMap from "./JourneyMap";

export const metadata = { title: "成长地图 — Zhuofan Li" };

export default function MapPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero map-hero"><p className="label">06 / LEARNING MAP</p><h1>不是直线升级，<br /><em>是带着问题前行。</em></h1><p>从一段段真实代码、一次次调试和可运行的项目里，画出自己的 AI 学习路径。</p></section><JourneyMap /><section className="map-note"><p className="label">MAP LEGEND</p><p>每一个节点都不是终点，而是下一次提问的起点。点击路径，查看当时真正需要解决的问题。</p></section><SiteFooter /></main>; }
