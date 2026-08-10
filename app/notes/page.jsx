import { SiteFooter, SiteHeader } from "../_components/SiteHeader";
import { notes } from "../_data/site-data";

export const metadata = { title: "学习笔记 — Zhuofan Li" };

export default function NotesPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero notes-hero"><p className="label">02 / LEARNING NOTES</p><h1>把踩过的坑，<br /><em>写成能复用的路标。</em></h1><p>短笔记记录我如何阅读模型、拆解错误，以及为结论划定证据边界。</p></section><section className="notes-list">{notes.map((note) => <article className="note-card" key={note.number}><div><span>{note.number}</span><span>{note.tag}</span></div><h2>{note.title}</h2><p>{note.lead}</p><ul>{note.points.map((point) => <li key={point}>{point}</li>)}</ul></article>)}</section><SiteFooter /></main>; }
