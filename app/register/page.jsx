import { AuthStation } from "../_components/AuthStation";
import { isEmailAuthConfigured } from "../../lib/auth";
export const metadata = { title: "注册", robots: { index: false, follow: false } };
export default async function RegisterPage({ searchParams }) { const params = await searchParams; return <AuthStation mode="register" next={params?.next} emailEnabled={isEmailAuthConfigured()} />; }
