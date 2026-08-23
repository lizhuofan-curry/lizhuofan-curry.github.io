# Changelog

本站的 bug 修复与功能/创新改动记录。每次改动先在此登记（日期、内容、涉及文件与提交），再提交。

## 2026-08-24

- **fix/security**：后台认证改为 fail closed，认证未配置时不再继续渲染 Studio；登录回跳严格限制为同源站内 URL，拒绝反斜杠与控制字符绕过。涉及 `lib/session.js`、`app/_components/AuthStation.jsx`。
- **fix/a11y**：修复手机端投篮场和导览助手的触摸滚动范围、深色主题强调按钮文字对比度、搜索输入焦点、在线状态读屏播报及筛选结果动态播报。涉及 `app/globals.css`、`app/_components/OnlinePresence.jsx`、`app/_components/FilterableGrid.jsx`。
- **fix**：消除筛选器 URL 同步的级联状态更新与投篮场渲染时读取 ref，保持中文输入法、历史导航和拖动站位行为。涉及 `app/_components/FilterableGrid.jsx`、`app/_components/PixelCourt.jsx`。
- **feat**：恢复首页“按兴趣探索路线”，直接使用当前已发布文章和项目生成可分享的三站路线，避免数据库内容与静态候选脱节；补桌面、手机和减少动态效果样式。涉及 `app/page.jsx`、`app/_components/PersonalPath.jsx`、`app/globals.css`。

## 2026-08-15

- **feat/docs**：新增 `/roadmap` 学习路线页面，将算法基础、PyTorch/机器学习、AI 应用产品和作品集沉淀串成公开路线；导航与 sitemap 同步加入路线入口，并补充路线页样式。涉及 `app/roadmap/page.jsx`、`app/_data/site.js`、`app/sitemap.js`、`app/globals.css`。
- **fix**：补匿名助手消息 30 天保留期清理——新增 `pruneAssistantMessages()`（惰性删除 `created_at` 早于 30 天前的 `assistant_messages`），在 `/api/assistant` 每次成功写入前顺带执行，满足 AGENTS.md「匿名助手消息保留期不超过 30 天」要求。涉及 `lib/assistant.js`、`app/api/assistant/route.js`。

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
- **fix**：投篮场篮架/三分线随球场宽度缩放（`courtScale`），并让篮板右缘与三分线对齐——修复手机端篮板伸出三分线、比例失调。涉及 `PixelCourt.jsx`。
- **fix**：投篮场——记分板精简（去掉标题/最高连中/常驻多枚勋章）、连击勋章改为只显示最高档且动态弹出约 2 秒后消失（尊重 `prefers-reduced-motion`）、移除「拖动站位·点击投篮」提示；蓝色油漆区（`.pixel-court-stage::after`）手机端等比缩小；记分板 `pointer-events: none` 不再挡住球员拖动。涉及 `PixelCourt.jsx`、`globals.css`。
- **fix**：证据徽章文案「证据 ×N」改为「可核验证据 ×N」并加 tooltip 说明用途；文章详情证据区补一句解释——解决「证据」含义不明的问题。涉及 `FilterableGrid.jsx`、`articles/[slug]/page.jsx`、`globals.css`。
- **fix**：删除投篮场比分 localStorage 持久化（刷新即重置为 0:0）；蓝色油漆区（`.pixel-court-stage::after`）右缘对齐三分线、桌面与手机端均收进三分线内不再超出。涉及 `PixelCourt.jsx`、`globals.css`。
- **fix**：回退三分线/篮架的 `courtScale` 缩放（恢复原固定几何，避免手机端三分线弧线探出球场 surface）；蓝色油漆区进一步缩小并收进三分线内。涉及 `PixelCourt.jsx`、`globals.css`。
- **fix**：三分线弧线放大（sideX/topY/baselineY 向外扩）、蓝色油漆区等比例放大并对称居中于弧线内（桌面+手机）、记分牌缩小、像素小人放大。涉及 `PixelCourt.jsx`、`globals.css`。
- **fix**：桌面端蓝色油漆区贴到球场右边缘（底线），并加大尺寸以匹配弧线比例。涉及 `globals.css`。
