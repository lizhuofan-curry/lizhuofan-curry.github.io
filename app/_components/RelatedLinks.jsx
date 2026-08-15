import Link from "next/link";
import { articles } from "../_data/articles";
import { projects } from "../_data/site-data";

// —— 跨类型相关推荐（服务端组件，纯函数，无客户端状态）——
// kind: "article" | "project"，current: 当前条目对象。
// 只做跨类型推荐：文章页推荐项目，项目页推荐文章；
// 候选池天然不含自身，因此无需额外排除。

const EVIDENCE_EXACT_MATCH = 4;
const EVIDENCE_PREFIX_MATCH = 3;
const TAG_MATCH = 1;
const CATEGORY_MATCH = 1;
const MAX_TAG_MATCHES = 2;
const MAX_RESULTS = 3;

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

// 按路径分段比较，避免 "repo" 与 "repoX" 这种裸字符串前缀误判。
function urlSegments(value) {
  return normalizeUrl(value).split("/").filter(Boolean);
}

function isSegmentPrefix(shortSegments, longSegments) {
  if (shortSegments.length >= longSegments.length) return false;
  return shortSegments.every((segment, index) => segment === longSegments[index]);
}

// evidence 链接与项目 href/demo 的关系：完全相同 → 最高分；互为路径前缀 → 次高分。
function evidenceLinkScore(evidenceUrl, targetUrl) {
  const evidence = normalizeUrl(evidenceUrl);
  const target = normalizeUrl(targetUrl);
  if (!evidence || !target) return 0;
  if (evidence === target) return EVIDENCE_EXACT_MATCH;
  const evidenceSegments = urlSegments(evidence);
  const targetSegments = urlSegments(target);
  const isPrefix =
    isSegmentPrefix(evidenceSegments, targetSegments) ||
    isSegmentPrefix(targetSegments, evidenceSegments);
  return isPrefix ? EVIDENCE_PREFIX_MATCH : 0;
}

// 对一对 (文章, 项目) 打分：evidence 最高，共享 tag 次之，共享 category 较低。
function scorePair(article, project) {
  let score = 0;
  let evidenceMatches = 0;
  const targetUrls = [project.href, project.demo].filter(Boolean);
  for (const evidenceUrl of article.evidence || []) {
    for (const targetUrl of targetUrls) {
      const matchScore = evidenceLinkScore(evidenceUrl, targetUrl);
      if (matchScore > 0) {
        score += matchScore;
        evidenceMatches += 1;
      }
    }
  }
  const sharedTags = (article.tags || []).filter((tag) => (project.tags || []).includes(tag)).length;
  score += Math.min(sharedTags, MAX_TAG_MATCHES) * TAG_MATCH;
  if (article.category && article.category === project.category) score += CATEGORY_MATCH;
  return { score, evidenceMatches, sharedTags };
}

function compareCandidates(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  if (b.evidenceMatches !== a.evidenceMatches) return b.evidenceMatches - a.evidenceMatches;
  if (b.sharedTags !== a.sharedTags) return b.sharedTags - a.sharedTags;
  return a.item.slug.localeCompare(b.item.slug);
}

export function RelatedLinks({ current, kind }) {
  if (!current) return null;

  const related =
    kind === "article"
      ? projects
          .map((project) => ({ ...scorePair(current, project), item: project, kind: "project" }))
          .filter((candidate) => candidate.score > 0)
          .sort(compareCandidates)
          .slice(0, MAX_RESULTS)
      : articles
          .map((article) => ({ ...scorePair(article, current), item: article, kind: "article" }))
          .filter((candidate) => candidate.score > 0)
          .sort(compareCandidates)
          .slice(0, MAX_RESULTS);

  if (related.length === 0) return null;

  return (
    <section className="related-links" aria-labelledby="related-links-heading">
      <h2 className="related-links-heading" id="related-links-heading">
        <span>相关推荐</span>
        <small>KEEP READING</small>
      </h2>
      <ul className="related-links-list">
        {related.map(({ item, kind: itemKind }) => (
          <li key={`${itemKind}-${item.slug}`}>
            <Link
              className="related-links-card"
              href={`/${itemKind === "project" ? "projects" : "articles"}/${item.slug}`}
            >
              <span className="related-links-type">{itemKind === "project" ? "项目" : "文章"}</span>
              <strong className="related-links-title">{item.title}</strong>
              <span className="related-links-desc">{item.description || item.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
