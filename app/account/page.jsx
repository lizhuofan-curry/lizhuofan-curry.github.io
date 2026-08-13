import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "../_components/LoginButton";
import { getCurrentViewer } from "../../lib/session";

export const metadata = { title: "账号", robots: { index: false, follow: false } };
export default async function AccountPage() { const viewer = await getCurrentViewer(); return <main id="main-content" className="account-page page-shell"><section className="account-card surface-card"><p>账号</p>{viewer.session ? <><div className="account-profile">{viewer.session.user.image && <Image src={viewer.session.user.image} alt="" width={72} height={72} unoptimized />}<div><h1>{viewer.session.user.name}</h1><p>{viewer.session.user.email}</p></div></div><p>当前权限：{viewer.role === "admin" ? "管理员" : "读者"}</p><div className="profile-actions">{viewer.role === "admin" && <Link className="primary-button" href="/studio">进入写作后台</Link>}<LogoutButton /></div></> : <><h1>尚未登录</h1><p>登录后可以为文章点赞。</p><Link className="primary-button" href="/login">前往登录</Link></>}</section></main>; }
