import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getPool, isDatabaseConfigured, query } from "./db";

let instance;

export function isAuthConfigured() {
  return Boolean(
    isDatabaseConfigured() &&
      process.env.BETTER_AUTH_SECRET &&
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET,
  );
}

export function getAuth() {
  if (!isAuthConfigured()) return null;
  if (!instance) {
    instance = betterAuth({
      database: getPool(),
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      trustedOrigins: [
        "http://localhost:3000",
        "https://preview.zhuofan.me",
        "https://www.zhuofan.me",
      ],
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      },
      session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
      rateLimit: { enabled: true, window: 60, max: 100 },
      advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
      plugins: [nextCookies()],
    });
  }
  return instance;
}

export async function getSessionFromHeaders(headers) {
  const auth = getAuth();
  if (!auth) return null;
  return auth.api.getSession({ headers });
}

export async function getRoleForUser(userId) {
  if (!userId || !isDatabaseConfigured()) return "reader";
  const adminGithubId = process.env.ADMIN_GITHUB_ID || "272723723";
  const { rows } = await query(
    `select exists(
       select 1 from account
       where "userId" = $1 and "providerId" = 'github' and "accountId" = $2
     ) as is_admin`,
    [userId, adminGithubId],
  );
  const role = rows[0]?.is_admin ? "admin" : "reader";
  await query(`
    insert into profiles (user_id, role)
    values ($1, $2)
    on conflict (user_id) do update set role = excluded.role, updated_at = now()
  `, [userId, role]);
  return role;
}
