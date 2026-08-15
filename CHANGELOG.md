# Changelog

本站的 bug 修复与功能/创新改动记录。每次改动先在此登记（日期、内容、涉及文件与提交），再提交。

## 2026-08-15

- **fix**：修复篮球像素小人（`PixelCourt`）点击/拖动时瞬移。根因：全局 `button:active` 的 `scale(.97)` 覆盖了 `.court-player` 的居中 `transform: translate(-50%, -50%)`，按下瞬间居中位移丢失导致跳位。改为 `button:active:not(.court-player)`。涉及 `app/globals.css`（commit `ec6379c`）。
- **docs**：同步 `AGENTS.md` 内容模型——补文章 `evidence`/`toc` 字段、`site-data.js` 的 `notes` 导出、`assistant-profile.js` 重要文件；`ASSET-CREDITS.md` 补 `spiderman-pixel-sprite.png` 署名。涉及 `AGENTS.md`、`ASSET-CREDITS.md`（commit `ad5a3df`）。
- **fix**：`robots.js` 的 `disallow` 去掉 `/studio` 尾斜杠并补 4 个认证页路径；`README.md` 对外姓名统一为 `Zhuo`；`articles.js` 的 `headingId` import 移到文件顶部。涉及 `app/robots.js`、`README.md`、`app/_data/articles.js`。
- **feat**：新增 `scripts/validate-content.mjs` 内容一致性校验脚本（零依赖，校验文章 slug ↔ `articleModules` 键 ↔ MDX 文件名三向一致、项目 slug 唯一且 `href` 可核验），并在 `package.json` 加 `validate:content` npm script。涉及 `scripts/validate-content.mjs`、`package.json`。
- **docs**：新增本 `CHANGELOG.md`，并在 `AGENTS.md` 开发流程加入「先记录、后提交」规则。
- **refactor**：`PersonalPath.jsx` 的路线标题与链接改为从 `articles.js`/`site-data.js` 注册表按 slug 派生，消除第二份硬编码副本的漂移风险（保留首页专用的短描述与兴趣信号）。涉及 `app/_components/PersonalPath.jsx`。
- **fix/docs**：`globals.css` 为 `button:active:not(.court-player)` 补注释说明排除原因（防回归）；`articles.js` 补 `source` 字段注入约定说明；`ASSET-CREDITS.md` 为 doraemon 条目补许可说明。涉及 `app/globals.css`、`app/_data/articles.js`、`ASSET-CREDITS.md`。
- **feat**：新增 GitHub Actions 工作流 `.github/workflows/validate.yml`，在 push/PR 时运行 `node scripts/validate-content.mjs` 做内容一致性校验。
- **feat**：投篮练习场（`PixelCourt`）比分持久化到 `localStorage`（键 `pixel-court-score`），刷新后保留命中/出手数；无效记录静默忽略。涉及 `app/_components/PixelCourt.jsx`。
- **feat**：全局搜索彻底统一到 DB 优先来源——`/api/search` 空查询返回最近 6 项，`SiteHeader` 搜索面板打开即拉取最近内容、优先用远端结果（静态 `searchItems` 仅作即时兜底）。涉及 `app/api/search/route.js`、`app/_components/SiteHeader.jsx`。
- **feat**：工程化收尾——新增 ESLint flat config（`eslint.config.mjs`，Next 16 core-web-vitals，将 `react-hooks/set-state-in-effect` 与 `react-hooks/refs` 两条激进规则降级为警告）、Prettier 配置（`.prettierrc.json` / `.prettierignore`），并在 `package.json` 加 `lint` / `format` 脚本与 devDependencies（eslint、eslint-config-next、prettier）。涉及 `eslint.config.mjs`、`.prettierrc.json`、`.prettierignore`、`package.json`、`package-lock.json`。
- **docs**：`ASSET-CREDITS.md` 补头像/图标视觉核验结论——`zhuo-avatar.png` 经 Qwen 视觉模型判定为「库里扁平插画、DiceBear 相邻风格、待替换」；`icon.png`/`apple-icon.png` 为像素风角色（合规）。涉及 `ASSET-CREDITS.md`。
- **feat**：证据链标注——文章/项目卡片显示「证据 ×N」可核验链接数徽章；文章详情页新增「可核验证据」区列出 evidence 链接。涉及 `FilterableGrid.jsx`、`articles/[slug]/page.jsx`、`globals.css`。
- **feat**：投篮练习场连击成就——新增命中率、最高连中（`bestStreak` 持久化到 localStorage）、连中徽章（≥3/5/8 解锁）。涉及 `PixelCourt.jsx`、`globals.css`。
- **feat**：跨类型相关推荐——新增 `RelatedLinks` 组件（按证据链接/共享标签/类别打分，文章↔项目互推），接入文章与项目详情页。涉及 `RelatedLinks.jsx`、`articles/[slug]/page.jsx`、`projects/[slug]/page.jsx`、`globals.css`。
- **feat**：登录/注册 UI 优化——打开自动聚焦首个输入框、错误提示置顶且 `role="alert"`、注册密码实时提示（长度/一致性）、弱化「AUTH.EXE」装饰面板并在手机端隐藏。涉及 `AuthStation.jsx`、`globals.css`。
