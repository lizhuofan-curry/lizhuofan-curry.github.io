"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeSlash, GithubLogo, Key, SpinnerGap } from "@phosphor-icons/react";
import { authClient } from "../../lib/auth-client";

function safeNext(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

function PasswordField({ id, label, value, onChange, autoComplete = "current-password" }) {
  const [visible, setVisible] = useState(false);
  return <label className="identity-field" htmlFor={id}><span>{label}</span><div className="password-control"><input id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} minLength={8} maxLength={128} autoComplete={autoComplete} required /><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "隐藏密码" : "显示密码"}>{visible ? <EyeSlash size={19} /> : <Eye size={19} />}</button></div></label>;
}

function AuthMessage({ status }) {
  if (!status) return null;
  return <p className={`identity-message ${status.kind}`} role="status">{status.text}</p>;
}

function GitHubButton({ callbackURL, pending, setPending, setStatus }) {
  async function signInWithGithub() {
    setPending("github");
    setStatus(null);
    const { error } = await authClient.signIn.social({ provider: "github", callbackURL });
    if (error) {
      setPending(null);
      setStatus({ kind: "error", text: "GitHub 登录暂时未能启动，请稍后重试。" });
    }
  }
  return <button className="identity-social" type="button" onClick={signInWithGithub} disabled={Boolean(pending)}>{pending === "github" ? <SpinnerGap className="spin" size={19} /> : <GithubLogo size={19} />}继续使用 GitHub</button>;
}

export function AuthStation({ mode = "login", next, emailEnabled = false, token }) {
  const callbackURL = useMemo(() => safeNext(next), [next]);
  const [active, setActive] = useState(mode === "register" ? "register" : "login");
  const [pending, setPending] = useState(null);
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);

  const busy = Boolean(pending);

  async function handleEmailLogin(event) {
    event.preventDefault();
    setPending("login"); setStatus(null);
    const { error } = await authClient.signIn.email({ email, password, rememberMe: true, callbackURL });
    if (error) {
      setPending(null);
      setStatus({ kind: "error", text: error.status === 403 ? "请先完成邮箱验证；你可以重新发送验证邮件。" : "邮箱或密码不正确，请检查后重试。" });
      return;
    }
    location.assign(callbackURL);
  }

  async function handleRegister(event) {
    event.preventDefault();
    if (password !== confirmPassword) return setStatus({ kind: "error", text: "两次输入的密码不一致。" });
    if (!consent) return setStatus({ kind: "error", text: "请先阅读并同意隐私说明。" });
    setPending("register"); setStatus(null);
    const { error } = await authClient.signUp.email({ name, email, password, callbackURL });
    setPending(null);
    if (error) return setStatus({ kind: "error", text: "暂时无法创建账号，请稍后重试。" });
    setStatus({ kind: "success", text: "如果该邮箱可以注册，验证链接已经发出。请前往邮箱完成验证。" });
  }

  async function resendVerification() {
    if (!email) return setStatus({ kind: "error", text: "请输入你的邮箱后再重新发送。" });
    setPending("verify"); setStatus(null);
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL });
    setPending(null);
    setStatus(error ? { kind: "error", text: "暂时无法发送验证邮件，请稍后重试。" } : { kind: "success", text: "如果该邮箱尚未验证，新的验证链接已经发送。" });
  }

  async function requestReset(event) {
    event.preventDefault();
    setPending("reset-request"); setStatus(null);
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: `${location.origin}/reset-password` });
    setPending(null);
    setStatus(error ? { kind: "error", text: "暂时无法处理请求，请稍后重试。" } : { kind: "success", text: "如果该邮箱存在账号，重置链接已经发送。" });
  }

  async function resetPassword(event) {
    event.preventDefault();
    if (!token) return setStatus({ kind: "error", text: "重置链接无效或已过期，请重新申请。" });
    if (password !== confirmPassword) return setStatus({ kind: "error", text: "两次输入的密码不一致。" });
    setPending("reset"); setStatus(null);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    setPending(null);
    if (error) return setStatus({ kind: "error", text: "重置链接无效或已过期，请重新申请。" });
    setStatus({ kind: "success", text: "密码已更新。你现在可以使用新密码登录。" });
  }

  const emailUnavailable = !emailEnabled;
  return <main id="main-content" className="identity-page page-shell"><section className="identity-station surface-card"><aside className="identity-signal" aria-hidden="true"><span>AUTH.EXE</span><strong>30</strong><i /><p>登录后保存<br />你的学习记录</p></aside><div className="identity-main"><p className="identity-kicker">身份站 / ZHUO</p>{mode === "forgot" ? <><h1>找回进入档案的钥匙。</h1><p className="identity-copy">输入邮箱后，如果账号存在，我们会发送一个可用的重置链接。</p><form className="identity-form" onSubmit={requestReset}><label className="identity-field"><span>邮箱</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><button className="primary-button" type="submit" disabled={busy}>{pending === "reset-request" && <SpinnerGap className="spin" size={18} />}发送重置链接</button></form><AuthMessage status={status} /><Link className="identity-text-link" href={`/login?next=${encodeURIComponent(callbackURL)}`}>返回登录</Link></> : mode === "reset" ? <><h1>设置一把新的钥匙。</h1><p className="identity-copy">新密码至少 8 位；完成后会撤销其他已登录设备。</p><form className="identity-form" onSubmit={resetPassword}><PasswordField id="new-password" label="新密码" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /><PasswordField id="confirm-password" label="确认新密码" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /><button className="primary-button" type="submit" disabled={busy || !token}>{pending === "reset" && <SpinnerGap className="spin" size={18} />}更新密码</button></form><AuthMessage status={status} /><Link className="identity-text-link" href="/forgot-password">重新申请重置链接</Link></> : mode === "verify" ? <><h1>查收你的验证邮件。</h1><p className="identity-copy">验证后会自动登录，并安全返回你刚才所在的页面。</p><form className="identity-form" onSubmit={(event) => { event.preventDefault(); resendVerification(); }}><label className="identity-field"><span>邮箱</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><button className="secondary-button" type="submit" disabled={busy || emailUnavailable}>{pending === "verify" && <SpinnerGap className="spin" size={18} />}重新发送验证邮件</button></form><AuthMessage status={status} /><Link className="identity-text-link" href={`/login?next=${encodeURIComponent(callbackURL)}`}>返回登录</Link></> : <><div className="identity-tabs" role="tablist"><button type="button" role="tab" aria-selected={active === "login"} onClick={() => { setActive("login"); setStatus(null); }}>登录</button><button type="button" role="tab" aria-selected={active === "register"} onClick={() => { setActive("register"); setStatus(null); }}>注册</button></div><h1>{active === "login" ? "回到你的学习档案。" : "创建一份自己的档案。"}</h1><p className="identity-copy">{active === "login" ? "使用邮箱密码或 GitHub 登录。会话会安全保存，方便下次继续阅读和点赞。" : "注册后请验证邮箱，再开始记录你的学习与作品。"}</p><GitHubButton callbackURL={callbackURL} pending={pending} setPending={setPending} setStatus={setStatus} /><div className="identity-divider"><span>或使用邮箱</span></div>{emailUnavailable ? <div className="identity-disabled"><Key size={19} /><span>邮箱登录正在准备中，请先使用 GitHub 登录。</span></div> : active === "login" ? <form className="identity-form" onSubmit={handleEmailLogin}><label className="identity-field"><span>邮箱</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><PasswordField id="login-password" label="密码" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="primary-button" type="submit" disabled={busy}>{pending === "login" && <SpinnerGap className="spin" size={18} />}使用邮箱登录</button><Link className="identity-text-link" href="/forgot-password">忘记密码？</Link></form> : <form className="identity-form" onSubmit={handleRegister}><label className="identity-field"><span>显示名称</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={1} maxLength={80} required /></label><label className="identity-field"><span>邮箱</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><PasswordField id="register-password" label="密码（至少 8 位）" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /><PasswordField id="register-password-confirm" label="确认密码" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /><label className="identity-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />我已阅读并同意 <Link href="/privacy" target="_blank">隐私说明</Link></label><button className="primary-button" type="submit" disabled={busy}>{pending === "register" && <SpinnerGap className="spin" size={18} />}创建并验证邮箱</button></form>}<AuthMessage status={status} /><p className="identity-footnote">我们不会获得你的 GitHub 密码；邮箱仅用于认证与安全通知。</p></>}</div></section></main>;
}
