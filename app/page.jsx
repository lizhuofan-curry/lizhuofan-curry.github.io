import { Explore, LearningPaths } from "./_components/Explore";
import { Nailoong } from "./_components/Nailoong";
import { Icon } from "./_components/Icon";
import { articles } from "./_data/articles";
import { siteConfig } from "./_data/site";
export default function Home() {
  return <main id="main-content" className="home-page page-shell">
    <section className="hero"><div className="hero-copy"><p className="status-line"><span/>在学习，也在创造</p><h1>你好，我是<br/><span className="hero-name">Zhuo<span className="name-dot">.</span></span></h1><p className="hero-description">探索 AI，也把想法<br className="desktop-break"/>做成可用的小工具。</p><p className="hero-aside">这里放着我的作品、实验，和一路上的小小发现。</p><div className="hero-actions"><a href="#selected-work" className="button primary">看看我的作品 <Icon name="down" size={18}/></a><a href={siteConfig.github} target="_blank" rel="noreferrer" className="text-link"><Icon name="github"/>GitHub</a></div></div><Nailoong/></section>
    <div className="hero-foot"><span>保持好奇，慢慢创造。</span><a href="#selected-work">往下逛逛 <Icon name="down" size={15}/></a></div>
    <Explore/><LearningPaths/>
    <section className="notes-section"><div className="notes-intro"><span className="section-icon"><Icon name="book" size={28}/></span><h2>写下来，<br/>慢慢想明白。</h2><p>一些项目里的思考，一些学习中的拆解。<br/>把零散的发现，整理成可以回看的笔记。</p><a className="text-link" href="/articles">翻翻全部笔记 <Icon name="arrow" size={18}/></a></div><div className="note-list">{articles.filter(a => !a.archived).slice(0,3).map(article => <a href={`/articles/${article.slug}`} key={article.slug} className="note-row"><div><span className="small-label">{article.category} <span className="muted"> / {article.readingTime}</span></span><h3>{article.title}</h3><p>{article.description}</p></div><Icon name="diagonal" size={20}/></a>)}</div></section>
    <section className="contact-section"><div><p className="section-kicker">很高兴在这里遇见你</p><h2>有意思的想法，<br/>一起聊聊？</h2></div><a href={`mailto:${siteConfig.email}`} className="button primary"><Icon name="mail"/>给我写封信</a><span className="contact-doodle" aria-hidden="true">✳</span></section>
  </main>;
}
