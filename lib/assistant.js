import { createHmac, randomUUID } from "node:crypto";
import { articles } from "../app/_data/articles";
import { assistantProfile } from "../app/_data/assistant-profile";
import { projects } from "../app/_data/site-data";
import { isDatabaseConfigured, query } from "./db";

const LIMITS = { reply: 600, session: 8000, minute: 6, daily: 100000 };
const publicItems = [
  { title: "关于 Zhuo", description: "了解学习方向和网站理念。", href: "/about", tags: ["Zhuo", "关于", "学习"] },
  ...articles.map((item) => ({ title: item.title, description: item.description, href: `/articles/${item.slug}`, tags: [...item.tags, ...item.keywords] })),
  ...projects.map((item) => ({ title: item.title, description: item.summary, href: `/projects/${item.slug}`, tags: [item.category, ...item.tags] })),
];

function secret() { return process.env.ASSISTANT_HASH_SECRET || process.env.VIEW_HASH_SECRET; }
function configuredModel() { return process.env.ASSISTANT_API_BASE_URL && process.env.ASSISTANT_API_KEY && process.env.ASSISTANT_MODEL; }
export function isAssistantConfigured() { return isDatabaseConfigured() && Boolean(secret()) && Boolean(configuredModel()); }
export function assistantSessionId(value) { return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value) ? value : randomUUID(); }
export function hashAssistantVisitor(ip) { return createHmac("sha256", secret()).update(ip || "unknown").digest("hex"); }

export function relatedLinks(question) {
  const terms = question.toLowerCase().split(/\s+/).filter((term) => term.length > 1);
  return publicItems
    .map((item) => ({ ...item, score: terms.reduce((total, term) => total + `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(term), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ title, href }) => ({ title, href }));
}

export function fallbackReply(question) {
  const links = relatedLinks(question);
  return { answer: links.length ? `模型服务暂时不可用。我可以先为你找到相关站内内容：${links.map((item) => item.title).join("、")}。` : "模型服务暂时不可用。恢复后我可以回答一般学习与技术问题，也可以介绍本站内容。", links, fallback: true };
}

export async function checkLimits(sessionId, visitorHash) {
  const [{ rows: minute }, { rows: session }, { rows: daily }] = await Promise.all([
    query("select count(*)::int as count from assistant_messages where visitor_hash = $1 and role = 'user' and created_at > now() - interval '1 minute'", [visitorHash]),
    query("select coalesce(sum(token_count), 0)::int as count from assistant_messages where session_id = $1", [sessionId]),
    query("select coalesce(sum(token_count), 0)::int as count from assistant_messages where created_at >= date_trunc('day', now())", []),
  ]);
  if (Number(minute[0]?.count || 0) >= LIMITS.minute) return { allowed: false, reason: "请求过于频繁，请稍后再试。" };
  if (Number(session[0]?.count || 0) >= LIMITS.session) return { allowed: false, reason: "这个会话的导览额度已用完，你可以直接浏览站内链接。" };
  if (Number(daily[0]?.count || 0) >= LIMITS.daily) return { allowed: false, reason: "今天的导览额度已用完，请直接浏览本站内容。" };
  return { allowed: true, remaining: Math.max(0, LIMITS.session - Number(session[0]?.count || 0)) };
}

export async function saveMessage({ sessionId, visitorHash, role, content, tokens = 0 }) {
  await query("insert into assistant_messages (session_id, visitor_hash, role, content, token_count) values ($1, $2, $3, $4, $5)", [sessionId, visitorHash, role, content, tokens]);
}

export async function askModel(question, pagePath) {
  const context = JSON.stringify({ profile: assistantProfile.facts, content: publicItems.map(({ title, description, href }) => ({ title, description, href })) });
  const system = `你是 Zhuo 个人网站上的中文学习伙伴与导览员。你可以回答一般性的学习、编程、AI、计算机视觉、深度学习和软件工程问题，也可以解释概念、给出简短的学习建议或代码思路。

涉及 Zhuo 本人、本站文章、项目、经历、数据、项目结论或未公开信息时，只能依据下列审核资料；资料没有依据就明确说不知道，绝不编造。一般知识回答时，区分通用建议与本站事实；不要声称自己浏览过互联网或掌握实时信息。若问题和站内内容有关，附上最相关的站内页面；若无关，则不必生硬附链接。回答使用中文，2 到 5 句，简洁、友好、可操作。资料：${context}`;
  const response = await fetch(`${process.env.ASSISTANT_API_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ASSISTANT_API_KEY}` },
    body: JSON.stringify({ model: process.env.ASSISTANT_MODEL, messages: [{ role: "system", content: system }, { role: "user", content: `当前页面：${pagePath}\n问题：${question}` }], max_tokens: LIMITS.reply, temperature: 0.35, thinking: { type: "disabled" } }),
  });
  if (!response.ok) throw new Error("ASSISTANT_PROVIDER_ERROR");
  const payload = await response.json();
  return { answer: String(payload.choices?.[0]?.message?.content || "").trim(), tokens: Number(payload.usage?.total_tokens || LIMITS.reply), links: relatedLinks(question) };
}
