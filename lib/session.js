import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getRoleForUser, getSessionFromHeaders, isAuthConfigured } from "./auth";

export async function getCurrentViewer() {
  if (!isAuthConfigured()) return { session: null, role: "reader", configured: false };
  try {
    const session = await getSessionFromHeaders(await headers());
    const role = session ? await getRoleForUser(session.user.id) : "reader";
    return { session, role, configured: true };
  } catch (error) {
    console.error("Unable to read the current session", error);
    return { session: null, role: "reader", configured: true, unavailable: true };
  }
}

export async function requireAdmin() {
  const viewer = await getCurrentViewer();
  // Protected routes must never become public just because auth is missing.
  if (!viewer.configured) notFound();
  if (!viewer.session) redirect("/login?next=/studio");
  if (viewer.role !== "admin") redirect("/account?denied=studio");
  return viewer;
}
