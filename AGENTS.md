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
- 首页为居中的可互动名片卡（我/文章/项目/关于 Tab），阅读页面保持清晰、克制。
- 优先做有辨识度且有用途的交互；所有交互不能依赖悬停才能使用。
- 必须尊重 `prefers-reduced-motion`；动画只作渐进增强，不能成为理解或导航的前提。
- 手机端不得产生横向溢出，需保留舒适触控目标、可见焦点、语义标题与可读对比度。
- 不得用现有个人照片生成新头像。
- 不得使用 AI 生成肖像、生成机器人吉祥物或 DiceBear 作为站点头像。理想替代品是来源清晰、已核验复用许可的线上像素美术资产；必须本地保存并记录来源和许可。

## 技术基线

- 框架：Next.js 16 App Router、React 19、JavaScript/JSX 与 MDX。
- 渲染与托管：服务端渲染的 Next.js 应用，当前部署在 Vercel；未来迁往阿里云时必须保持公开路由和服务端 API 不变。
- 运行时服务：Better Auth、通过 `pg` 使用 PostgreSQL、可替换的 Supabase Storage 媒体适配器与 Resend 邮件。浏览器代码绝不能取得数据库、存储管理、邮件或 OAuth 密钥。
- 图片使用 `next/image`，并保持 `images.unoptimized: true`，以兼容当前素材管线。
- 字体来自本地 `geist` 包和中文系统字体栈；不得引入远程 CSS 字体。
- 公开 API 包含认证、搜索、文章浏览/点赞和管理员媒体上传。Studio 路由及所有写入端点都必须在服务端校验会话与角色。
- 可选站点助手通过服务端 `ASSISTANT_API_BASE_URL`、`ASSISTANT_API_KEY`、`ASSISTANT_MODEL` 与 `ASSISTANT_HASH_SECRET` 调用 OpenAI 兼容供应商。绝不能在浏览器代码、命令输出或提交中暴露或记录这些值。
- 助手可以回答通用学习与技术问题；但关于 Zhuo、本站或仓库项目的陈述必须基于已审核公开资料。匿名助手消息只存储访客 HMAC 摘要，保留期不得超过 30 天。
- 管理员身份只能由 `ADMIN_GITHUB_ID` 环境变量确定，不能根据显示名或邮箱推断。
- 规范站点 URL 仅在 `app/_data/site.js` 的 `siteConfig.siteUrl` 中定义一次。

## 公开路由

- `/`
- `/articles`
- `/articles/[slug]`
- `/projects`
- `/projects/[slug]`
- `/saved`（个性化本机收藏，`noindex`）
- `/about`
- `/login`、`/register`、`/verify-email`、`/forgot-password`、`/reset-password`、`/account`、`/privacy`
- `/studio` 与 `/studio/*` 仅限管理员，且必须 `noindex`。

旧 Museum、Garden、Lab、Map 和 Now 路由有意不再支持，可返回 404。新增公开路由在合适时必须加入 sitemap。

## 重要文件

- `app/layout.jsx`：全局元数据、字体、结构化数据、页头、页脚与跳转链接。
- `app/globals.css`：站点令牌与共享响应式样式。
- `app/_data/site.js`：站点身份、规范 URL、联系方式与主导航。
- `app/_data/articles.js`：文章元数据及 MDX 模块注册。
- `app/_data/site-data.js`：项目元数据与经验证的项目证据。
- `app/_data/search.js`：由文章和项目生成的共享浏览器端搜索索引。
- `app/_components/SiteHeader.jsx`：导航、可访问全局搜索对话框与像素档案状态栏（首页不显示状态栏）。
- `app/_components/FilterableGrid.jsx`：文章/项目搜索、标签与 URL 状态。
- `app/_components/HomeCard.jsx`：首页「一屏一卡」互动名片——我/文章/项目/关于四个 Tab、方向滑入动画、可互动像素头像、入口按钮与公告跑马灯。
- `app/_components/GuestCount.jsx`：首页底部真实在线人数，与 `OnlinePresence` 共用会话 ID 不重复计数。
- `app/_components/PersonalPath.jsx`、`app/_components/PixelCourt.jsx`：2026-08 起从首页移除，组件文件保留但全站无引用。
- `app/_components/SaveButton.jsx`、`app/_components/SavedItems.jsx`、`lib/saved-items.client.js`：仅保存在当前浏览器的文章/项目收藏、收藏页与跨标签页同步。
- `app/_components/SiteAssistant.jsx`、`app/_data/assistant-profile.js`、`app/api/assistant/route.js`、`lib/assistant.js`：可拖动哆啦A梦导览及其导览资料、受保护的服务端模型边界、匿名会话限制与审核上下文。
- `app/articles/_content/*.mdx`：文章正文。
- `app/sitemap.js` 与 `app/robots.js`：仅供公开内容的发现元数据。
- `lib/auth.js`、`lib/email.js`、`lib/db.js`、`lib/media-storage.js`：可替换的认证、邮件、数据库与存储服务端边界。
- `app/_components/OnlinePresence.jsx`、`app/api/presence/route.js`、`lib/presence.js`：可选匿名在线状态；不得阻塞页面渲染。
- `db/migrations/001_fullstack_blog.sql`：Better Auth 与博客架构。
- `db/migrations/002_site_presence.sql`：匿名在线状态的哈希会话表。
- `docs/FULLSTACK_SETUP.md` 与 `docs/SELF_HOSTING.md`：Vercel 配置及未来自托管说明。
- `.github/workflows/deploy-pages.yml`：已废弃的提醒工作流；GitHub Pages 无法运行本全栈站点。

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

## 搜索与 URL 状态规则

- 筛选状态保存在浏览器与 URL 中；全局搜索 API 只返回已发布数据库文章和仓库项目。
- 文章/项目筛选使用 `q` 与 `tag` 查询参数，以便刷新、浏览历史和分享链接恢复状态。
- 首页名片卡的 Tab 状态保存在组件内，不写入 URL（2026-08 起取代原 `path` 个性化路线参数）。
- 中文输入法必须安全处理组合输入：`compositionstart` 期间不得把中间拉丁字母写入 URL；应在 `compositionend` 后同步最终值。
- 搜索对话框打开时必须捕获键盘焦点，Escape 关闭后将焦点返还给触发器，并提供明确的空状态与重置状态。

## 在线状态

- 首页指示器统计最近 90 秒活跃的匿名浏览器会话；它是实时活动信号，不是独立访客或分析指标。
- 浏览器创建随机 `sessionStorage` UUID，并且最多每 45 秒发送一次心跳；服务端仅保存 HMAC 哈希，不保存原始 UUID、IP 或身份。
- `PRESENCE_HASH_SECRET` 可独立配置；`VIEW_HASH_SECRET` 是有意设置的后备项。数据库或密钥不可用时，指示器应静默不可用，不能影响导航或内容。
- 视觉语言需和全站圆角卡片语言一致；动画仅作装饰，必须被现有 `prefers-reduced-motion` 策略禁用。

## 站点导览助手

- 浮动哆啦A梦导览是全身像素宠物，不是圆形图标或站点头像。它可在视口中任意移动，位置保存于浏览器本地，并提供重置操作。
- 面板展示本次访问期间的可滚动内存对话记录。提交问题后必须立即清空输入；服务端文本需在展示前清理，链接只能指向公开站内路由。
- 竹蜻蜓使用克制、常驻、仅 `transform` 的动画；不得影响点按打开，并且在 `prefers-reduced-motion` 下停止。
- 桌面面板应半透明且可读；手机端须置于安全视口内、无横向溢出、保留舒适输入目标和足够的消息滚动区。
- 未经站点所有者明确同意，不得提高当前单次回复、会话、分钟或全站日 token 限额。

## 开发流程

```bash
npm install
npm run dev
npm run build
npm run start
```

- Node.js 需要 20.9 或更高版本。`npm run build` 是基础验证，必须完成所有公开与动态路由编译。
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
4. 用中文输入法测试文章/项目搜索，包括组合文本、清除、查询参数恢复、刷新和前进/后退。
5. 测试首页名片卡：四个 Tab 切换与方向滑入、头像互动（看向鼠标/点击反馈）、主题切换后深浅模式、公告与在线人数的降级表现。
6. 测试 `prefers-reduced-motion: reduce`，确认没有动画时内容仍可理解。
7. 验证站内链接和外部证据链接；不得静默替换损坏证据或用未经支持的文案代替。
8. 涉及认证时，在部署环境测试邮件注册、验证、会话持久化、退出、重置密码、角色检查和安全的 `next` 跳转。

## 素材来源

- 优先使用自有素材或许可清晰的可信素材库。
- 外部素材须下载到仓库，不能依赖不稳定的热链接。
- 在素材署名文件中记录名称、创作者、来源 URL、许可、修改与下载日期。
- 不得绕过来源网站的访问控制或下载流程。
- `public/spiderman-pixel-sprite.png` 由站点所有者提供，并确认于 2026-08-14 获得公开使用授权。必须保留 `ASSET-CREDITS.md` 中的署名；不得用未验证作品替换。
- `public/doraemon-pixel-guide.png` 是已选定的浮动导览素材。其当前来源与修改说明必须保留在 `ASSET-CREDITS.md`。
