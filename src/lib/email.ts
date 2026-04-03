import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "jordanhilario@protonmail.com";

export async function notifyNewSubmission(name: string, email: string) {
  if (!resend) {
    console.log("[email] Resend not configured, skipping notification for:", name);
    return;
  }

  try {
    await resend.emails.send({
      from: "OPM Fingerstyle <notifications@opmfingerstyle.com>",
      to: ADMIN_EMAIL,
      subject: `New Profile Submission: ${name}`,
      html: `
        <h2>New Guitarist Submission</h2>
        <p><strong>${name}</strong> (${email}) has submitted a profile for review.</p>
        <p><a href="https://opmfingerstyle.com/admin/guitarists?status=pending_review">Review in Admin Panel →</a></p>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}

export async function notifyNewContactMessage(name: string, subject: string) {
  if (!resend) {
    console.log("[email] Resend not configured, skipping contact notification from:", name);
    return;
  }

  try {
    await resend.emails.send({
      from: "OPM Fingerstyle <notifications@opmfingerstyle.com>",
      to: ADMIN_EMAIL,
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>${name}</strong> sent a message about: ${subject}</p>
        <p><a href="https://opmfingerstyle.com/admin/messages">View in Admin Panel →</a></p>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}
