import { engagementSessionSchema } from "../../../lib/validation";
import { hashPresenceSession, isPresenceConfigured, recordPresence } from "../../../lib/presence";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isPresenceConfigured()) {
    return Response.json({ onlineCount: 0, configured: false }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const { sessionId } = engagementSessionSchema.parse(await request.json());
    const result = await recordPresence(hashPresenceSession(sessionId));
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error?.name === "ZodError") return Response.json({ error: "会话标识无效" }, { status: 400 });
    console.error("Presence heartbeat failed", error);
    return Response.json({ error: "暂时无法读取在线状态" }, { status: 500 });
  }
}
