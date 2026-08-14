import { askModel, assistantSessionId, checkLimits, fallbackReply, hashAssistantVisitor, isAssistantConfigured, saveMessage } from "../../../lib/assistant";

export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    const body = await request.json();
    const question = String(body.question || "").trim();
    const pagePath = String(body.pagePath || "/").slice(0, 200);
    if (!question || question.length > 500) return Response.json({ error: "请输入 1 到 500 个字符的问题。" }, { status: 400 });
    if (!isAssistantConfigured()) return Response.json({ ...fallbackReply(question), configured: false }, { headers: { "Cache-Control": "no-store" } });
    const sessionId = assistantSessionId(body.sessionId);
    const visitorHash = hashAssistantVisitor(request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown");
    const limit = await checkLimits(sessionId, visitorHash);
    if (!limit.allowed) return Response.json({ ...fallbackReply(question), configured: true, limited: true, reason: limit.reason, sessionId }, { headers: { "Cache-Control": "no-store" } });
    await saveMessage({ sessionId, visitorHash, role: "user", content: question });
    try {
      const result = await askModel(question, pagePath);
      await saveMessage({ sessionId, visitorHash, role: "assistant", content: result.answer, tokens: result.tokens });
      return Response.json({ ...result, configured: true, sessionId, remaining: Math.max(0, limit.remaining - result.tokens) }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return Response.json({ ...fallbackReply(question), configured: true, fallback: true, sessionId }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch (error) {
    console.error("Assistant request failed", error);
    return Response.json({ error: "导览员暂时无法回答，请稍后再试。" }, { status: 500 });
  }
}
