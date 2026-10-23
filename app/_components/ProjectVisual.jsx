import Image from "next/image";
import { Icon } from "./Icon";
export function ProjectVisual({ project, detail = false }) {
  if (project.image) return <figure className={`project-visual ${project.accent} ${detail ? "detail-visual" : ""}`}><div className="browser-bar" aria-hidden="true"><i/><i/><i/><span>{project.title}</span></div><Image src={project.image} alt={`${project.title} 的仓库界面截图`} width={1440} height={1000} sizes={detail ? "(max-width: 800px) 100vw, 1100px" : "(max-width: 700px) 92vw, 650px"}/><figcaption>仓库界面截图</figcaption></figure>;
  if (project.slug === "henubci") return <figure className={`project-visual schedule-visual ${detail ? "detail-visual" : ""}`} aria-label="HenuBCI 协作流程示意，不是真实成员数据">
    <div className="schedule-preview"><div className="schedule-top"><span className="mini-logo"><Icon name="grid"/></span><strong>把大家的时间，连在一起。</strong></div><div className="schedule-days">{["周一","周二","周三","周四","周五"].map(x => <span key={x}>{x}</span>)}</div><div className="schedule-grid">{Array.from({length:15},(_,i) => <span key={i} className={[1,3,5,9,12].includes(i) ? "slot busy" : "slot"}>{({1:"课程",3:"讨论",5:"实验",9:"任务",12:"课程"})[i]}</span>)}</div><div className="schedule-match"><span className="avatar-stack"><i>Z</i><i>L</i><i>Y</i></span><span>共同空闲，一目了然</span><Icon name="check" size={18}/></div></div><figcaption>协作功能示意 · 非真实课表</figcaption>
  </figure>;
  return <div className={`project-visual code-visual ${project.accent}`}><Icon name="code" size={48}/><span>{project.title}</span><p>用代码，把理解留下来。</p></div>;
}
