import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "../../../../lib/auth";

function unavailable() {
  return Response.json({ error: "登录服务尚未配置" }, { status: 503 });
}

const auth = getAuth();
const handler = auth ? toNextJsHandler(auth) : null;

export async function GET(request) {
  const fallback = handler?.GET || unavailable;
  const pathname = new URL(request.url).pathname;
  try {
    const response = await fallback(request);
    if (pathname.endsWith("/get-session") && response.status >= 500) {
      return Response.json({ session: null, user: null }, { status: 200 });
    }
    return response;
  } catch (error) {
    if (pathname.endsWith("/get-session")) {
      console.error("Session lookup is temporarily unavailable", error);
      return Response.json({ session: null, user: null }, { status: 200 });
    }
    throw error;
  }
}

export const POST = handler?.POST || unavailable;
