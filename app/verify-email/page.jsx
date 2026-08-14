import { AuthStation } from "../_components/AuthStation";
import { isEmailAuthConfigured } from "../../lib/auth";
export const metadata = { title: "验证邮箱", robots: { index: false, follow: false } };
export default async function VerifyEmailPage({ searchParams }) { const params = await searchParams; return <AuthStation mode="verify" next={params?.next} emailEnabled={isEmailAuthConfigured()} />; }
