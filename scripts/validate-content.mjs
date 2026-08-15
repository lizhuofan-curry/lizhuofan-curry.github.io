#!/usr/bin/env node
/**
 * validate-content.mjs
 *
 * 内容一致性校验脚本（Node ESM，零依赖，纯文本解析，无需数据库/网络）。
 *
 * 校验对象（相对仓库根目录）：
 *   - app/_data/articles.js          文章注册表（articles 的 slug 与 articleModules 的 key）
 *   - app/articles/_content/*.mdx    文章正文文件
 *   - app/_data/site-data.js         项目注册表（projects 的 slug 与 href）
 *
 * 一致性规则（AGENTS.md）：
 *   文章的 slug == articleModules 的 key == MDX 文件名（去扩展名）；
 *   不得有孤儿条目；slug 不得重复；项目必须能由链接核验（href 非空且为 http(s)）。
 *
 * 说明：这些数据文件是 ESM 且含 MDX 动态 import() 与浏览器端语法，Node 无法稳定
 * 加载，因此这里用纯文本正则 + 括号配平解析，不做 import。
 *
 * 用法：node scripts/validate-content.mjs
 * 退出码：全部通过为 0；任何不一致为 1。
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ARTICLES_FILE = path.join(ROOT, "app", "_data", "articles.js");
const SITE_DATA_FILE = path.join(ROOT, "app", "_data", "site-data.js");
const CONTENT_DIR = path.join(ROOT, "app", "articles", "_content");

const errors = [];
function fail(message) {
  errors.push(message);
  console.error(`[错误] ${message}`);
}

/**
 * 从源码中提取「从 startMarker 起、以 openChar 开头、以与之配平的 closeChar 结尾」
 * 的顶层代码块。逐字符扫描并跳过字符串字面量（含转义），保证嵌套括号与引号内的
 * 字符不参与配平。
 */
function extractBlock(source, startMarker, openChar, closeChar) {
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error(`未找到声明「${startMarker}」`);
  }
  const openIdx = source.indexOf(openChar, startIdx);
  if (openIdx === -1) {
    throw new Error(`「${startMarker}」之后未找到起始字符「${openChar}」`);
  }
  let depth = 0;
  let inString = false;
  let quote = "";
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return source.slice(openIdx, i + 1);
    }
  }
  throw new Error(`「${startMarker}」的代码块未闭合（缺少「${closeChar}」）`);
}

/** 提取代码块中全部满足 pattern（须含捕获组 1）的捕获值。 */
function captures(block, pattern) {
  return [...block.matchAll(pattern)].map((match) => match[1]);
}

/**
 * 将形如「[ { ... }, { ... } ]」的顶层对象数组块拆成逐条对象条目。
 * 以深度为 0 的「}」作为条目边界，字符串字面量内容不参与配平。
 */
function splitObjectEntries(block) {
  const inner = block.slice(1, -1); // 去掉外层 [ ]
  const entries = [];
  let depth = 0;
  let inString = false;
  let quote = "";
  let current = "";
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inString) {
      current += ch;
      if (ch === "\\") {
        if (i + 1 < inner.length) {
          current += inner[i + 1];
          i++;
        }
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0 && ch === "}") {
        entries.push(current + "}");
        current = "";
        continue;
      }
    }
    current += ch;
  }
  return entries.filter((entry) => entry.trim().length > 0);
}

// ---------- 读取源文件 ----------
let articlesSource = null;
let siteSource = null;
try {
  articlesSource = readFileSync(ARTICLES_FILE, "utf8");
} catch (cause) {
  fail(`无法读取文章注册表：${ARTICLES_FILE}（${cause.message}）`);
}
try {
  siteSource = readFileSync(SITE_DATA_FILE, "utf8");
} catch (cause) {
  fail(`无法读取项目注册表：${SITE_DATA_FILE}（${cause.message}）`);
}

// ---------- 文章注册表解析 ----------
const articleSlugs = [];   // articles[].slug
const moduleKeys = [];     // articleModules 的 key
const moduleImports = [];  // articleModules 的 import 路径
if (articlesSource) {
  try {
    const articlesBlock = extractBlock(articlesSource, "export const articles", "[", "]");
    const modulesBlock = extractBlock(articlesSource, "export const articleModules", "{", "}");
    articleSlugs.push(...captures(articlesBlock, /slug:\s*"([^"]+)"/g));
    for (const match of modulesBlock.matchAll(
      /"([^"]+)"\s*:\s*\(\s*\)\s*=>\s*import\s*\(\s*"([^"]+)"\s*\)/g
    )) {
      moduleKeys.push(match[1]);
      moduleImports.push(match[2]);
    }
  } catch (cause) {
    fail(`解析 ${ARTICLES_FILE} 失败：${cause.message}`);
  }
}

// ---------- MDX 文件列表 ----------
let mdxFiles = [];
try {
  mdxFiles = readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.slice(0, -".mdx".length));
} catch (cause) {
  fail(`无法读取文章目录：${CONTENT_DIR}（${cause.message}）`);
}

// ---------- 文章一致性校验 ----------
const seenSlugs = new Set();
for (const slug of articleSlugs) {
  if (seenSlugs.has(slug)) fail(`重复的 slug：${slug}`);
  seenSlugs.add(slug);
}

const slugSet = new Set(articleSlugs);
const moduleSet = new Set(moduleKeys);
const mdxSet = new Set(mdxFiles);

for (const slug of articleSlugs) {
  if (!moduleSet.has(slug)) {
    fail(`文章 slug「${slug}」未在 articleModules 中注册（${ARTICLES_FILE}）`);
  }
}
moduleKeys.forEach((key, index) => {
  if (!slugSet.has(key)) {
    fail(`articleModules 键「${key}」没有对应的 articles 条目（孤儿注册）`);
  }
  if (!mdxSet.has(key)) {
    fail(`articleModules 键「${key}」缺少 MDX 文件：app/articles/_content/${key}.mdx`);
  }
  const importPath = moduleImports[index];
  if (importPath && path.basename(importPath) !== `${key}.mdx`) {
    fail(`articleModules 键「${key}」的 import 路径与键不一致：${importPath}`);
  }
});
for (const file of mdxFiles) {
  if (!moduleSet.has(file)) {
    fail(`孤儿 MDX 文件：app/articles/_content/${file}.mdx 未在 articleModules 中注册`);
  }
}

// ---------- 项目注册表解析与校验 ----------
const projects = [];
if (siteSource) {
  try {
    const projectsBlock = extractBlock(siteSource, "export const projects", "[", "]");
    for (const entry of splitObjectEntries(projectsBlock)) {
      projects.push({
        slug: entry.match(/slug:\s*"([^"]+)"/)?.[1] ?? null,
        href: entry.match(/href:\s*"([^"]*)"/)?.[1] ?? null,
      });
    }
  } catch (cause) {
    fail(`解析 ${SITE_DATA_FILE} 失败：${cause.message}`);
  }
}

const seenProjectSlugs = new Set();
for (const project of projects) {
  if (project.slug === null) {
    fail(`存在缺少 slug 的项目条目（${SITE_DATA_FILE}）`);
    continue;
  }
  if (seenProjectSlugs.has(project.slug)) {
    fail(`重复的项目 slug：${project.slug}`);
  }
  seenProjectSlugs.add(project.slug);

  if (project.href === null || project.href.trim() === "") {
    fail(`项目「${project.slug}」的 href 为空或缺失，无法由链接核验（${SITE_DATA_FILE}）`);
  } else if (!/^https?:\/\//.test(project.href)) {
    fail(`项目「${project.slug}」的 href 不是 http(s) 链接：${project.href}`);
  }
}

// ---------- 汇总 ----------
if (errors.length > 0) {
  console.error(`\n校验未通过：共发现 ${errors.length} 处不一致。`);
  process.exitCode = 1;
} else {
  console.log(`通过：${articleSlugs.length} 篇文章、${projects.length} 个项目`);
  console.log(`（articleModules 键 ${moduleKeys.length} 个、MDX 文件 ${mdxFiles.length} 个，全部一致）`);
}
