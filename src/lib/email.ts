import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const dev = process.env.NODE_ENV !== "production";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    // No key configured (e.g. fresh clone): don't crash flows — log and move on.
    console.warn("[email] RESEND_API_KEY missing — email NOT sent:", subject);
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Arik CRM <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] send failed:", error);
    // Deliberate: we do NOT throw. Email failure shouldn't break the flow —
    // the reset/invite still exists; user can retry or staff can copy-link.
    return { skipped: false, error };
  }

  if (dev) console.log("[email] sent:", subject, "→", to, "id:", data?.id);
  return { skipped: false, id: data?.id };
}

/** Shared shell so all Arik emails look consistent. */
export function emailLayout(title: string, bodyHtml: string, ctaUrl: string, ctaLabel: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f6f4;padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e7e3df;overflow:hidden;">
      <div style="background:#e31c21;padding:20px 28px;">
        <span style="color:#ffffff;font-size:16px;font-weight:bold;letter-spacing:2px;">ARIK</span>
        <span style="color:#ffd9da;font-size:10px;letter-spacing:2px;"> IMMIGRATION CONSULTING</span>
      </div>
      <div style="padding:28px;">
        <h1 style="font-size:18px;color:#1b1714;margin:0 0 12px;">${title}</h1>
        <div style="font-size:14px;color:#5c554e;line-height:1.6;">${bodyHtml}</div>
        <a href="${ctaUrl}" style="display:inline-block;margin-top:20px;background:#e31c21;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:11px 24px;border-radius:8px;">${ctaLabel}</a>
        <p style="font-size:12px;color:#8a827a;margin-top:20px;">If the button doesn't work, copy this link:<br>
        <span style="word-break:break-all;color:#5c554e;">${ctaUrl}</span></p>
      </div>
    </div>
  </div>`;
}