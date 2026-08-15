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
