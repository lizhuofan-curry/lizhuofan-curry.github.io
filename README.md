# Zhuo 的个人空间

中文个人作品集，Next.js 16 + React 19 + MDX。包含奶龙互动、深浅模式、全站搜索及原生页面过渡。

## 本地运行

```sh
npm ci
NEXT_TELEMETRY_DISABLED=1 npm run dev
```

## 构建与启动

```sh
NEXT_TELEMETRY_DISABLED=1 npm run build
NEXT_TELEMETRY_DISABLED=1 npm run start
```

## 更新内容

- 项目资料：`app/_data/site-data.js`。
- 笔记元数据和注册：`app/_data/articles.js`。
- 笔记正文：`app/articles/_content/*.mdx`。
- 联系方式及规范域名：`app/_data/site.js`。
- 图片：`public/images/`；来源见 `ASSET-CREDITS.md`。
- 视觉约定：`DESIGN.md`。

旧文章与项目地址保留在归档中。新增笔记需同时添加 MDX 与注册条目；运行 `npm run validate:content` 检查。项目描述以公开仓库为依据，不能将计划写成已实现功能。

## 部署

现有 Vercel 项目 `zhuo-blog-preview`，规范域名 `https://www.zhuofan.me`，根域名转向 www。代码仓库 `lizhuofan-curry/lizhuofan-curry.github.io`。仅在完成构建与浏览器验证后部署。
