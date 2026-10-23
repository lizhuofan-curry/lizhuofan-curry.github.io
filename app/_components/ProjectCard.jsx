import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
export function ProjectCard({ project, featured = false }) {
  return <a href={`/projects/${project.slug}`} className={`project-card ${featured ? "featured-project" : ""}`}>
    <div className="project-copy"><span className="project-category"><Icon name={project.slug === "wenqu" ? "book" : project.slug === "henubci" ? "grid" : "spark"} size={16}/>{project.category}</span><h3>{project.title}<Icon name="diagonal" size={22}/></h3><p>{project.summary}</p><div className="tags">{project.tags.slice(0,3).map(tag => <span key={tag}>{tag}</span>)}</div>{featured && <span className="case-link">看看这个项目 <Icon name="arrow" size={18}/></span>}</div>
    <ProjectVisual project={project}/>
  </a>;
}
