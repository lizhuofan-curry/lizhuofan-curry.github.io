import Link from "next/link";
import { LoginButton } from "../_components/LoginButton";
import { isAuthConfigured } from "../../lib/auth";

export const metadata = { title: "登录", robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }) { const params = await searchParams; const next = typeof params?.next === "string" && params.next.startsWith("/") && !params.next.startsWith("//") ? params.next : "/account"; const configured = isAuthConfigured(); return <main id="main-content" className="auth-page page-shell"><section className="auth-card surface-card"><p>读者账号</p><h1>登录后，为真正有帮助的文章留下一个赞。</h1><p>第一版仅使用 GitHub 登录。本站不会获得你的 GitHub 密码。</p>{configured ? <LoginButton callbackURL={next} /> : <div className="setup-notice"><strong>登录服务等待配置</strong><p>复制 `.env.example` 并填写数据库、Better Auth 与 GitHub OAuth 凭据后即可启用。</p></div>}<Link href="/privacy">查看隐私说明</Link></section></main>; }
