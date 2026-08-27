import { getPublishedArticles } from "../lib/content";
import { projects } from "./_data/site-data";
import { HomeCard } from "./_components/HomeCard";
import { GuestCount } from "./_components/GuestCount";

export default async function Home() {
  const articles = (await getPublishedArticles()).slice(0, 4).map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    readingTime: article.readingTime,
  }));
  const featuredProjects = projects.slice(0, 4).map((project) => ({
    slug: project.slug,
    number: project.number,
    title: project.title,
    summary: project.summary,
    category: project.category,
  }));

  return (
    <main id="main-content">
      <div className="home-stage">
        <div className="home-deco" aria-hidden="true">
          <span className="deco-ring" />
          <span className="deco-sq" />
          <span className="deco-code">{"</>"}</span>
          <span className="deco-ring" />
          <span className="deco-sq" />
          <span className="deco-code">{"{ }"}</span>
        </div>
        <HomeCard articles={articles} projects={featuredProjects} />
        <div className="home-stage-foot">
          <div className="house">@ 2026 ZHUO&apos;S HOUSE</div>
          <GuestCount />
        </div>
      </div>
    </main>
  );
}
