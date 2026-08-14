# 自建服务器迁移接口

网站的浏览器接口保持不变：认证始终走 `/api/auth/*`，文章、点赞、观看和媒体接口也只由本站域名提供。前端不直接连接 Vercel、Supabase 或 Resend。

## 需要迁移的服务端适配层

- `lib/db.js`：标准 `pg.Pool`。把 `DATABASE_URL` 换成阿里云 PostgreSQL 连接串，并按数据库要求设置 `DATABASE_SSL=require`；若数据库仅通过同一 VPC 的可信私网访问，可显式设为 `disable`。
- `lib/auth.js`：Better Auth 使用同一个 PostgreSQL 表和 `/api/auth/[...all]` 路由；将 `BETTER_AUTH_URL` 和 `AUTH_TRUSTED_ORIGINS` 改为正式域名。
- `lib/email.js`：只暴露 `sendAuthEmail`。迁到阿里云邮件推送或其他服务时，替换这个文件的实现，页面和 Better Auth 回调不变。
- `lib/media-storage.js`：路由只依赖 `put`、`delete`、`publicUrl` 三个方法。当前 `MEDIA_STORAGE_DRIVER=supabase`；未来新增阿里云 OSS 适配器时，在该文件实现 `oss` 分支，不把 OSS 密钥或直传逻辑暴露给浏览器。

## 部署约束

- 将域名反向代理到 Next.js 服务，保留 HTTPS，并设置 `BETTER_AUTH_URL=https://www.zhuofan.me`。
- 生产环境必须设置 `BETTER_AUTH_SECRET`、`VIEW_HASH_SECRET`、数据库连接、邮件凭据和 OAuth 凭据；不要把任何密钥提交进仓库。
- 自建长驻进程保持 `DATABASE_ALLOW_EXIT_ON_IDLE=false`（默认值）；仅在确认无状态短进程需要快速退出时才设为 `true`。
- 反向代理应正确转发单一可信客户端 IP 头；Better Auth 的限流依赖真实来源信息。
- 数据库备份和媒体文件备份分别执行；迁移后先验证 GitHub 登录、邮箱验证、重置密码和现有文章访问。
- 当前 Better Auth 内置限流适合单个应用实例；未来横向扩容时，应将认证邮件限流迁到 Redis 或网关层，确保多个实例共用同一计数。
