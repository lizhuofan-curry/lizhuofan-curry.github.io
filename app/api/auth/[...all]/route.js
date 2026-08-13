import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "../../../../lib/auth";

function unavailable() {
  return Response.json({ error: "登录服务尚未配置" }, { status: 503 });
}

const auth = getAuth();
const handler = auth ? toNextJsHandler(auth) : null;

export const GET = handler?.GET || unavailable;
export const POST = handler?.POST || unavailable;
