"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { success: false, error: "Email is required." };

  const serviceClient = await createServiceClient();

  // Generate recovery link
  const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: "https://opmfingerstyle.com/auth/confirm",
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    // Don't reveal if email exists or not
    return { success: true };
  }

  // Send via Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "OPM Fingerstyle <noreply@opmfingerstyle.com>",
      to: email,
      subject: "Reset your OPM Fingerstyle password",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your OPM Fingerstyle account.</p>
        <p><a href="${linkData.properties.action_link}" style="display:inline-block;background:#D4A017;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600;">Reset Password</a></p>
        <p>If the button doesn't work, copy and paste this link:<br><a href="${linkData.properties.action_link}">${linkData.properties.action_link}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>— OPM Fingerstyle Team</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send reset email:", err);
  }

  return { success: true };
}
