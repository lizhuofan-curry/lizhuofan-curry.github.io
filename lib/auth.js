import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getPool, isDatabaseConfigured, query } from "./db";
import { isEmailDeliveryConfigured, sendAuthEmail } from "./email";

let instance;

function getTrustedOrigins() {
  const configured = (process.env.AUTH_TRUSTED_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
  return [...new Set(["http://localhost:3000", process.env.BETTER_AUTH_URL, ...configured].filter(Boolean))];
}

export function isAuthConfigured() {
  return Boolean(isDatabaseConfigured() && process.env.BETTER_AUTH_SECRET);
}

export function isGitHubAuthConfigured() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export function isEmailAuthConfigured() {
  return Boolean(isDatabaseConfigured() && process.env.BETTER_AUTH_SECRET && isEmailDeliveryConfigured());
}

export function getAuth() {
  if (!isAuthConfigured()) return null;
  if (!instance) {
    instance = betterAuth({
      database: getPool(),
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      trustedOrigins: getTrustedOrigins(),
      socialProviders: isGitHubAuthConfigured()
        ? {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          }
        : {},
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        resetPasswordTokenExpiresIn: 60 * 60,
        sendResetPassword: async ({ user, url }) => {
          await sendAuthEmail({
            to: user.email,
            subject: "重置你的 Zhuo 账号密码",
            preview: "我们收到了重置密码的请求。这个链接仅用于设置新密码。",
            actionLabel: "重置密码",
            actionUrl: url,
          });
        },
      },
      emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60,
        sendVerificationEmail: async ({ user, url }) => {
          await sendAuthEmail({
            to: user.email,
            subject: "验证你的 Zhuo 账号",
            preview: "完成验证后即可使用邮箱登录、点赞和管理自己的站内账户。",
            actionLabel: "验证邮箱",
            actionUrl: url,
          });
        },
      },
      account: {
        encryptOAuthTokens: true,
        accountLinking: {
          enabled: true,
          trustedProviders: ["github", "email-password"],
          allowDifferentEmails: false,
          updateUserInfoOnLink: false,
        },
      },
      session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
      rateLimit: {
        enabled: true,
        window: 60,
        max: 30,
        customRules: {
          "/sign-up/email": { window: 60 * 60, max: 5 },
          "/sign-in/email": { window: 15 * 60, max: 12 },
          "/send-verification-email": { window: 60 * 60, max: 5 },
          "/request-password-reset": { window: 60 * 60, max: 5 },
        },
      },
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
  const adminGithubId = process.env.ADMIN_GITHUB_ID;
  if (!adminGithubId) return "reader";
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
