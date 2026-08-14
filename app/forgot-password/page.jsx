import { AuthStation } from "../_components/AuthStation";
import { isEmailAuthConfigured } from "../../lib/auth";

export const metadata = { title: "找回密码", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <AuthStation mode="forgot" emailEnabled={isEmailAuthConfigured()} />;
}
