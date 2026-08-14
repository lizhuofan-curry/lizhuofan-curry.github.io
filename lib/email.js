import { Resend } from "resend";

let client;

export function isEmailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.AUTH_FROM_EMAIL);
}

function getClient() {
  if (!isEmailDeliveryConfigured()) {
    throw new Error("EMAIL_DELIVERY_NOT_CONFIGURED");
  }
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendAuthEmail({ to, subject, preview, actionLabel, actionUrl }) {
  const safeUrl = new URL(actionUrl);
  const html = `
    <main style="max-width:560px;margin:0 auto;padding:32px;font-family:Arial,'Microsoft YaHei',sans-serif;color:#173761;background:#f7fbff">
      <p style="margin:0 0 16px;color:#2864c7;font-size:12px;letter-spacing:1.5px">ZHUO · IDENTITY STATION</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.25">${subject}</h1>
      <p style="margin:0 0 24px;color:#52729a;line-height:1.7">${preview}</p>
      <a href="${safeUrl.toString()}" style="display:inline-block;padding:13px 18px;color:#fff;background:#2864c7;text-decoration:none;font-weight:700">${actionLabel}</a>
      <p style="margin:28px 0 0;color:#52729a;font-size:12px;line-height:1.7">如果不是你本人发起的操作，可以忽略此邮件。请勿转发此链接。</p>
    </main>`;
  const { error } = await getClient().emails.send({
    from: process.env.AUTH_FROM_EMAIL,
    to,
    subject,
    html,
    text: `${preview}\n\n${actionLabel}: ${safeUrl.toString()}\n\n如果不是你本人发起的操作，可以忽略此邮件。`,
  });
  if (error) throw new Error(`EMAIL_DELIVERY_FAILED: ${error.message}`);
}
