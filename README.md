# Zhuo 的个人博客与项目档案

一个使用 Next.js 的中文个人网站，内容聚焦文章、项目与可验证的学习过程。公开内容、写作后台、认证和媒体上传由同一应用提供。

运行环境：Node.js 20.9 或更高版本。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run start
```

完整的数据库、认证、邮箱和媒体配置见 [docs/FULLSTACK_SETUP.md](docs/FULLSTACK_SETUP.md)。后续迁移到阿里云服务器时，参见 [docs/SELF_HOSTING.md](docs/SELF_HOSTING.md)。

## 内容结构

- `/`：主页与互动学习信号场
- `/articles`：MDX 文章、搜索与标签筛选
- `/projects`：项目档案、搜索与标签筛选
- `/about`：个人介绍与联系方式

网站事实仅来自公开仓库和已有内容，不补写不可验证的个人经历或成果。

## 哆啦A梦导览助手

网站右下角提供可拖动的像素导览助手：点击打开半透明对话面板，可保留本次访问的聊天记录；桌面与手机均会记住小人的位置，并提供重置操作。竹蜻蜓是纯视觉动效，系统开启“减少动态效果”后会自动停止。

助手优先介绍本站公开文章、项目与 Zhuo 的已审核资料，也可回答一般学习、编程、AI、计算机视觉和软件工程问题。涉及 Zhuo 或本站项目的事实不会由模型推测。

要启用服务端模型，请在部署平台配置以下环境变量；它们绝不能写入浏览器代码或提交到仓库：

```text
ASSISTANT_API_BASE_URL=
ASSISTANT_API_KEY=
ASSISTANT_MODEL=
ASSISTANT_HASH_SECRET=
```

未配置模型、模型请求失败或额度耗尽时，助手会降级为站内链接导览。单次回答、匿名会话、分钟频率与全站日用量均在服务端限制，以控制 token 消耗。
