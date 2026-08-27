import Link from "next/link";
import { projects } from "../_data/site-data";

export const metadata = { title: "小项目", description: "Zhuo 的人工智能、计算机视觉和 LLM 工程项目。", alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="blog-page">
      <header className="blog-header">
        <h1>小项目</h1>
        <p>做出来，再写下来。</p>
        <p className="blog-count">共 {projects.length} 个项目</p>
      </header>
      <div className="article-list">
        {projects.map((project, index) => (
          <Link href={`/projects/${project.slug}`} className="article-item" style={{ "--i": index }} key={project.slug}>
            <h2 className="title">
              <span className="item-number">{project.number}</span>
              {project.title}
            </h2>
            <p className="summary">{project.summary}</p>
            <div className="details">
              <span className="detail-item">#{project.category}</span>
              {project.tags.slice(0, 3).map((tag) => (
                <span className="detail-item" key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
