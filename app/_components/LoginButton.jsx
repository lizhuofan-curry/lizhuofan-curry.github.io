"use client";

import { GithubLogo } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

export function LoginButton({ callbackURL = "/account" }) {
  return <button className="primary-button auth-button" type="button" onClick={() => authClient.signIn.social({ provider: "github", callbackURL })}><GithubLogo size={21} />使用 GitHub 登录</button>;
}

export function LogoutButton() {
  const router = useRouter();
  return <button className="secondary-button" type="button" onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } })}>退出登录</button>;
}
