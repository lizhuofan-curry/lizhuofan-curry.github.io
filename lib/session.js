import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRoleForUser, getSessionFromHeaders, isAuthConfigured } from "./auth";

export async function getCurrentViewer() {
  if (!isAuthConfigured()) return { session: null, role: "reader", configured: false };
  const session = await getSessionFromHeaders(await headers());
  const role = session ? await getRoleForUser(session.user.id) : "reader";
  return { session, role, configured: true };
}

export async function requireAdmin() {
  const viewer = await getCurrentViewer();
  if (!viewer.configured) return viewer;
  if (!viewer.session) redirect("/login?next=/studio");
  if (viewer.role !== "admin") redirect("/account?denied=studio");
  return viewer;
}
