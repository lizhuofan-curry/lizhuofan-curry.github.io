# Changelog

本站的 bug 修复与功能/创新改动记录。每次改动先在此登记（日期、内容、涉及文件与提交），再提交。

## 2026-08-27

- **feat/design**：首页视觉大幅重构，向 daidr.me 极简克制风格靠拢——保留「首页/文章/项目/关于」四模块 Tab 结构，但去掉厚重边框与阴影、缩小头像至 96px、增大姓名字号、社交入口改为简洁胶囊链接、文章/项目列表改为无边框简洁行、关于面板改为段落 + 标签云。涉及 `app/_components/HomeCard.jsx`、`app/globals.css`。
- **feat/design**：首页隐藏全局导航栏，非首页导航去掉登录/注册入口（暂时隐藏 `AuthMenu`），保留搜索与主题切换。涉及 `app/_components/SiteHeader.jsx`、`app/layout.jsx`。
- **refactor**：清理 `globals.css` 中已废弃的 `.home-hero`、`.hero-court`、`.pixel-court-stage`、`.personal-path`、`.basketball-cursor` 等样式块及媒体查询残留，减少约 18KB 无用 CSS。涉及 `app/globals.css`。
- **style**：全局令牌微调——`--radius-card` 从 16px 增至 20px，`--shadow` 强度降低，让整体更轻盈。涉及 `app/globals.css`。

## 2026-08-26

- **fix/design**：首页名片卡的邮件入口由 ✉️ 表情换成 Phosphor `EnvelopeSimple` 图标，与 GitHub 入口风格统一。涉及 `app/_components/HomeCard.jsx`。
- **fix/design**：首页名片卡的 GitHub 入口由 🐙 表情换成 Phosphor `GithubLogo` 官方风格图标（与登录页 GitHub 按钮一致），悬停变色与提示气泡行为不变。涉及 `app/_components/HomeCard.jsx`。
- 以下首页重构、列表页、详情页/关于页、认证页/路线页四期设计改动与文档同步统一为单笔提交（`feat: restyle site as dual-theme rounded card language`）。
- **docs**：同步 `AGENTS.md` 与重构后现状——视觉方向更新为蓝白/slate 双模式圆角卡片语言，重要文件改列 `HomeCard.jsx`/`GuestCount.jsx` 并标注 `PersonalPath.jsx`/`PixelCourt.jsx` 已从首页移除，`notes` 标注为暂无引用，URL 状态规则移除首页 `path` 参数，在线状态与验证清单第 5 条改为名片卡口径。涉及 `AGENTS.md`。
- **feat/design**：认证页（登录/注册/找回与重置密码/验证邮箱）、账户页与学习路线页统一为新卡片语言——认证卡去掉 3px 描边与硬阴影，左侧信号面板改为柔和蓝色渐变 + 白色大号字符（去掉黄色球场色装饰与文字描影），Tab 与社交登录按钮胶囊化，输入框 1px 圆角描边 + 柔和聚焦环，表单提示条圆角化并适配深色模式；`.surface-card` 全站统一为 1px 描边；路线页去掉像素虚线轨道与节点硬阴影，链接徽章胶囊化。以追加覆盖方式实现，不改组件结构。涉及 `app/globals.css`。
- **feat/design**：文章详情页、项目详情页与关于页统一为新卡片语言——去掉像素侧轨、页面顶部像素块、斜切渐变、硬阴影与虚线边框；阅读卡/目录卡/证据区/相关推荐/项目证据卡/联系横幅统一为 1px 描边 + 柔和投影 + 圆角；引用块、行内代码、代码块、标签与点赞按钮改为柔和胶囊风；关于页旅程卡改为 accent 左边条 + 柔和数字徽章，价值观卡取消错位与旋转悬停；深色模式下证据卡/联系横幅改为柔和表面卡以避免对比度问题。以追加覆盖方式实现，不改组件结构。涉及 `app/globals.css`。
- **feat/design**：文章/项目列表页统一为新卡片语言——页面头去掉硬阴影、斜切渐变与像素徽章（改为柔和圆角徽章），筛选组改 1px 描边 + 胶囊标签，内容网格取消 12 列像素马赛克改为统一双列圆角白卡（悬停上浮 + 描边高亮），「可核验证据」徽章改为柔和胶囊；手机端单列堆叠。以追加覆盖方式实现，不改组件结构。涉及 `app/globals.css`。
- **chore**：删除设计预览临时公开文件 `public/design-preview/`（用户确认）。

- **feat/design**：首页重构为「一屏一卡」互动名片——居中卡片内嵌 我/文章/项目/关于 四个 Tab（面板按方向左右滑入、卡片宽度随面板平滑变化），「我」面板为可互动像素头像（看向鼠标、点击跳跃+星星+随机冒泡、在线小绿点、当地时钟）、圆形入口按钮与公告跑马灯；舞台底部为 "@ 2026 ZHUO'S HOUSE" 与真实在线人数（新增 `GuestCount`，与 `OnlinePresence` 共用会话 ID 不重复计数）。全局令牌换成蓝白浅色 + slate 深色双模式（沿用 `zhuo-theme`），硬像素阴影改为柔和投影、圆角放大；首页隐藏像素状态栏。原 `PixelCourt`/`PersonalPath` 从首页移除（组件文件保留）。涉及 `app/globals.css`、`app/page.jsx`、`app/_components/HomeCard.jsx`（新增）、`app/_components/GuestCount.jsx`（新增）、`app/_components/SiteHeader.jsx`。
- **fix/content**：问渠项目的在线体验入口更新为新域名 `https://wenqu.zhuofan.me/`。涉及 `app/_data/site-data.js`。

## 2026-08-24

- **feat**：新增浏览器本地“收藏”功能——文章与项目详情页可收藏/取消收藏，新增 `/saved` 个性化收藏页，支持跨标签页同步、空状态、失效条目提示、逐项移除、移除后焦点衔接与内联确认清空；收藏只保存类型、slug 和时间，不上传服务器。同步补主导航、页脚、手机端 3×2 导航、文章发布后刷新收藏目录、无障碍状态与项目文档。涉及 `lib/saved-items.client.js`、`app/_components/SaveButton.jsx`、`app/_components/SavedItems.jsx`、`app/saved/page.jsx`、文章/项目详情页、`SiteFooter.jsx`、`site.js`、`app/studio/actions.js`、`globals.css`、`AGENTS.md`（commit `7ccb479`）。
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
