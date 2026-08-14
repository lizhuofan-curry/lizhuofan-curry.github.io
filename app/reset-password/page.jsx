import { AuthStation } from "../_components/AuthStation";
import { isEmailAuthConfigured } from "../../lib/auth";

export const metadata = { title: "重置密码", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  return <AuthStation mode="reset" token={typeof params?.token === "string" ? params.token : ""} emailEnabled={isEmailAuthConfigured()} />;
}
