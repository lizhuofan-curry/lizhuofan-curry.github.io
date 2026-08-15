# Full-stack setup

The repository can build without cloud credentials. In that state, public pages use the verified MDX content and login, engagement, publishing, and uploads report that setup is incomplete.

## Supabase

1. Create a Supabase project.
2. Open the SQL editor and run the files in `db/migrations/` in numeric order, including `004_article_comments.sql` for article comments.
3. Create a public Storage bucket named `article-media`.
4. Set its file limit to 5 MB and allow JPEG, PNG, WebP, and GIF.
5. Copy the transaction-pooler connection string into `DATABASE_URL`.

The application connects to PostgreSQL on the server. Do not expose the database password or the Supabase service-role key to browser code.

## GitHub OAuth

Create separate GitHub OAuth applications for local, preview, and production environments because each environment has a different callback URL:

- `http://localhost:3000/api/auth/callback/github`
- `https://preview.zhuofan.me/api/auth/callback/github`
- `https://www.zhuofan.me/api/auth/callback/github`

Use the matching client ID and secret in each environment. The administrator is identified by the immutable GitHub account ID in `ADMIN_GITHUB_ID`.

## Environment

Copy `.env.example` to `.env.local`, generate two independent random secrets, and fill every required value. Add the same values to the Vercel preview environment, using `https://preview.zhuofan.me` for `BETTER_AUTH_URL`.

## Preview cutover

1. Import the repository into Vercel without changing the current GitHub Pages DNS records.
2. Bind `preview.zhuofan.me` to the Vercel project.
3. Verify email registration, email verification, password login, password reset, GitHub login, draft publishing, media upload, views, likes, comments, sitemap, desktop, and mobile layouts.
4. Only after acceptance, move `www.zhuofan.me` to Vercel and replace the production OAuth credentials.
5. Keep the GitHub Pages deployment and previous DNS values available for rollback during the first release window.

## Email/password login and comments

Email/password sign-in is enabled only when PostgreSQL, `BETTER_AUTH_SECRET`, and Resend email delivery are configured. In every environment, set `BETTER_AUTH_URL` to that environment's public origin and include it in `AUTH_TRUSTED_ORIGINS`. Set `AUTH_FROM_EMAIL` to a verified Resend sender before testing registration, verification, or password reset.

Comments require the same PostgreSQL database and migration `004_article_comments.sql`. They are public immediately after submission by a signed-in user; authors can edit or soft-delete only their own public comments, while administrators manage all comments at `/studio/comments`. The browser only calls Next.js routes: never grant Supabase anon or authenticated roles direct table access.
