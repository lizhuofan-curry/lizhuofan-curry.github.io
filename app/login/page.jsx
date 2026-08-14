import { AuthStation } from "../_components/AuthStation";
import { isAuthConfigured, isEmailAuthConfigured } from "../../lib/auth";

export const metadata = { title: "登录", robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }) { const params = await searchParams; const next = typeof params?.next === "string" ? params.next : "/account"; return isAuthConfigured() ? <AuthStation next={next} emailEnabled={isEmailAuthConfigured()} /> : <AuthStation next={next} emailEnabled={false} />; }
