"use client";

import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@phosphor-icons/react";
import { authClient } from "../../lib/auth-client";

function ConfiguredAuthMenu() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <span className="auth-placeholder" aria-hidden="true" />;
  if (!session) return <Link className="login-link" href="/login"><SignIn size={18} />登录</Link>;
  return <Link className="account-link" href="/account" aria-label="打开账号页面">{session.user.image ? <Image src={session.user.image} alt="" width={32} height={32} unoptimized /> : <span>{session.user.name?.slice(0, 1) || "Z"}</span>}</Link>;
}

export function AuthMenu({ configured = false }) {
  if (!configured) return <Link className="login-link" href="/login"><SignIn size={18} />登录</Link>;
  return <ConfiguredAuthMenu />;
}
