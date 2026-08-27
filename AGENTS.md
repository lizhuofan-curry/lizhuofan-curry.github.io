# AGENTS.md

本文记录本仓库的长期项目背景与协作规则。

## 项目定位

- 这是 Zhuo 的中文个人博客与项目档案。
- 网站向招聘方及技术同行展示文章、项目与可核验的学习过程。
- 对外公开姓名：`Zhuo`。
- 不得虚构日期、工作经历、成果指标、个人经验或项目结论。公开事实必须能由本仓库、已链接的公开仓库，或用户明确提供的来源支持。
- 验证集指标不得表述为测试集结论；必须区分观察、证据与结论。

## 产品与视觉方向

- 整体风格为蓝白浅色 / slate 深色双模式的圆角卡片档案（2026-08 重构，参考戴兜的小屋的克制卡片语言）；像素篮球作为遗产保留在素材与头像中，不再是界面主语言。
- 首页为居中的可互动名片卡（我/文章/项目/关于 Tab），文章与项目列表页为 daidr.me 风格极简列表，阅读页面保持清晰、克制。
- 优先做有辨识度且有用途的交互；所有交互不能依赖悬停才能使用。
- 必须尊重 `prefers-reduced-motion`；动画只作渐进增强，不能成为理解或导航的前提。
- 手机端不得产生横向溢出，需保留舒适触控目标、可见焦点、语义标题与可读对比度。
- 不得用现有个人照片生成新头像。
- 不得使用 AI 生成肖像、生成机器人吉祥物或 DiceBear 作为站点头像。理想替代品是来源清晰、已核验复用许可的线上像素美术资产；必须本地保存并记录来源和许可。

## 技术基线

- 框架：Next.js 16 App Router、React 19、JavaScript/JSX 与 MDX。
- 渲染与托管：纯静态内容的服务端渲染 Next.js 应用，当前部署在 Vercel；2026-08 起已移除数据库、认证、邮件与对象存储等全部服务端运行时依赖，全站内容来自仓库内 MDX 与数据注册表。
- 图片使用 `next/image`，并保持 `images.unoptimized: true`，以兼容当前素材管线。
- 字体来自本地 `geist` 包和中文系统字体栈；不得引入远程 CSS 字体。
- 公开 API 只有 `/api/search`（只读本地文章与项目数据）。不要新增写入端点，除非同步恢复完整的服务端校验与文档。
- 规范站点 URL 仅在 `app/_data/site.js` 的 `siteConfig.siteUrl` 中定义一次。

## 公开路由

- `/`
- `/articles`
- `/articles/[slug]`
- `/projects`
- `/projects/[slug]`
- `/about`
- `/privacy`

旧 Museum、Garden、Lab、Map、Now 路由，以及 2026-08 移除的 `/login`、`/register`、`/verify-email`、`/forgot-password`、`/reset-password`、`/account`、`/saved`、`/roadmap`、`/studio` 路由有意不再支持，可返回 404。新增公开路由在合适时必须加入 sitemap。

## 重要文件

- `app/layout.jsx`：全局元数据、字体、结构化数据、页头、页脚与跳转链接。
- `app/template.jsx`：页面切换时的入场过渡包裹层（`.page-transition`）。
- `app/globals.css`：站点令牌与共享响应式样式；daidr.me 风格的列表、导航与过渡样式集中在文件末尾的专属区块。
- `app/_data/site.js`：站点身份、规范 URL、联系方式与主导航（我/文章/小项目/更多）。
- `app/_data/articles.js`：文章元数据及 MDX 模块注册。
- `app/_data/site-data.js`：项目元数据与经验证的项目证据。
- `app/_data/search.js`：由文章和项目生成的共享浏览器端搜索索引。
- `app/_components/SiteHeader.jsx`：非首页极简导航（头像 + 名字 + menu-item 导航）、可访问全局搜索对话框；首页不渲染 header。
- `app/_components/HomeCard.jsx`：首页「一屏一卡」互动名片——我/文章/项目/关于四个 Tab、方向滑入动画、可互动像素头像、入口按钮与公告跑马灯。
- `app/articles/_content/*.mdx`：文章正文。
- `app/sitemap.js` 与 `app/robots.js`：仅供公开内容的发现元数据。
- `lib/content.js`：已发布文章的本地读取（仅 MDX 回退路径，附加 `viewCount`/`likeCount` 占位字段）。
- `lib/headings.js`：标题锚点 ID 生成。
- `.github/workflows/deploy-pages.yml`：已废弃的提醒工作流；GitHub Pages 无法运行本站点。

## 内容模型

`app/_data/articles.js` 中的文章使用：

- `slug`
- `title`
- `description`
- `tags`
- `category`
- `readingTime`
- `keywords`
- `evidence`（可核验的证据链接数组）
- `toc`（由 `lib/headings.js` 的 `headingId` 生成的目录数组）

每篇新文章都必须在 `app/articles/_content/` 中有 MDX 文件，并在 `articleModules` 中有对应条目。slug、注册表键、文件名、链接、元数据、搜索索引与静态参数必须一致。

`app/_data/site-data.js` 中的项目使用：

- `slug`、`number`、`eyebrow`、`title`
- `summary`、`copy`、`category`
- `tags`、`href`、可选 `demo`
- `accent`、`signal`、`question`、`role`、`highlights`

只能加入可由链接仓库或用户明确来源核验的主张。证据不足时，应使用简洁项目卡，而不是编造详细案例。

`app/_data/site-data.js` 还导出 `notes`（原首页学习笔记卡片；2026-08 首页重构后暂无引用，保留供后续使用），使用 `number`、`title`、`tag`、`lead`、`points` 字段。

## 搜索规则

- 全局搜索 API（`/api/search`）只返回仓库内已发布文章和项目；`SiteHeader` 搜索面板优先用远端结果，静态 `searchItems` 作即时兜底。
- 首页名片卡的 Tab 状态保存在组件内，不写入 URL。
- 搜索对话框打开时必须捕获键盘焦点，Escape 关闭后将焦点返还给触发器，并提供明确的空状态与重置状态。

## 开发流程

```bash
npm install
npm run dev
npm run build
npm run start
```

- Node.js 需要 20.9 或更高版本。`npm run build` 是基础验证，必须完成所有公开路由编译。
- 当前 Vercel 部署 `main`。旧 GitHub Pages 工作流已废弃，除非恢复静态架构，否则不得重新启用。
- 保留无关工作区变动。不得为获得干净工作区而删除、重置或改写用户工作。
- 不得提交生成的 `.next/`、`out/`、本地缓存或临时截图。
- 除非用户明确要求，否则不得 push、开 PR、合并或部署。
- 每次修复 bug 或做出功能/创新改动，都必须先在 `CHANGELOG.md` 记录（日期、改动内容、涉及文件与提交），再提交；先记录、后提交。

## 验证清单

交付前按风险完成相关测试：

1. 运行 `npm run build`，确认文章页、项目页、图标、sitemap 与 robots 输出生成。
2. 检查桌面和常见手机宽度的溢出、布局、焦点可见性和触控可用性。
3. 测试全局搜索、空结果、Escape 关闭、焦点恢复和键盘导航。
4. 测试首页名片卡：四个 Tab 切换与方向滑入、头像互动（看向鼠标/点击反馈）、主题切换后深浅模式与公告跑马灯的降级表现。
5. 测试 `prefers-reduced-motion: reduce`，确认没有动画时内容仍可理解。
6. 验证站内链接和外部证据链接；不得静默替换损坏证据或用未经支持的文案代替。

## 素材来源

- 优先使用自有素材或许可清晰的可信素材库。
- 外部素材须下载到仓库，不能依赖不稳定的热链接。
- 在素材署名文件中记录名称、创作者、来源 URL、许可、修改与下载日期。
- 不得绕过来源网站的访问控制或下载流程。
- `public/spiderman-pixel-sprite.png` 由站点所有者提供，并确认于 2026-08-14 获得公开使用授权。必须保留 `ASSET-CREDITS.md` 中的署名；不得用未验证作品替换。
- `public/doraemon-pixel-guide.png` 是已选定的导航头像素材（原浮动导览已随 2026-08 重构移除）。其当前来源与修改说明必须保留在 `ASSET-CREDITS.md`。
