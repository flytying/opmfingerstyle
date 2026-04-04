"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function updateGuitarist(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guitarists")
    .update({
      display_name: formData.get("display_name") as string,
      slug: formData.get("slug") as string,
      location: (formData.get("location") as string) || null,
      youtube_channel_url: (formData.get("youtube_channel_url") as string) || null,
      bio_short: formData.get("bio_short") as string,
      bio_full: (formData.get("bio_full") as string) || null,
      featured: formData.get("featured") === "on",
    })
    .eq("id", id);

  if (error) {
    console.error("Update failed:", error);
    return { success: false, error: "Failed to update guitarist." };
  }

  return { success: true };
}

export async function approveGuitarist(id: string) {
  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  // Get guitarist details
  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("contact_email, display_name")
    .eq("id", id)
    .single();

  if (!guitarist?.contact_email) {
    return { success: false, error: "Guitarist has no contact email." };
  }

  // Create auth user with a temporary random password
  const tempPassword = crypto.randomUUID();
  const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
    email: guitarist.contact_email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      role: "guitarist",
      display_name: guitarist.display_name,
    },
  });

  if (authError) {
    console.error("Failed to create user:", authError);
    return { success: false, error: `Failed to create account: ${authError.message}` };
  }

  // Link user to guitarist and approve
  const { error: updateError } = await supabase
    .from("guitarists")
    .update({
      approval_status: "approved" as const,
      user_id: authUser.user.id,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to approve:", updateError);
    return { success: false, error: "Failed to update guitarist status." };
  }

  // Generate recovery link and send branded email via Resend
  const { data: linkData } = await serviceClient.auth.admin.generateLink({
    type: "recovery",
    email: guitarist.contact_email,
    options: {
      redirectTo: "https://opmfingerstyle.com/auth/confirm",
    },
  });

  if (linkData?.properties?.action_link) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "OPM Fingerstyle <noreply@opmfingerstyle.com>",
      to: guitarist.contact_email,
      subject: "Welcome to OPM Fingerstyle — Set Your Password",
      html: `
        <h2>Welcome to OPM Fingerstyle!</h2>
        <p>Hi ${guitarist.display_name},</p>
        <p>Your guitarist profile has been approved! Click the link below to set your password and access your dashboard.</p>
        <p><a href="${linkData.properties.action_link}" style="display:inline-block;background:#D4A017;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600;">Set Your Password</a></p>
        <p>If the button doesn't work, copy and paste this link:<br><a href="${linkData.properties.action_link}">${linkData.properties.action_link}</a></p>
        <p>— OPM Fingerstyle Team</p>
      `,
    });
  }

  return { success: true };
}

export async function rejectGuitarist(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guitarists")
    .update({ approval_status: "rejected" as const })
    .eq("id", id);

  if (error) {
    console.error("Reject failed:", error);
    return { success: false, error: "Failed to reject guitarist." };
  }

  return { success: true };
}

export async function resendInvite(id: string) {
  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("contact_email, display_name")
    .eq("id", id)
    .single();

  if (!guitarist?.contact_email) {
    return { success: false, error: "Guitarist has no contact email." };
  }

  // Generate a password reset link via Supabase
  const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: "recovery",
    email: guitarist.contact_email,
    options: {
      redirectTo: "https://opmfingerstyle.com/auth/confirm",
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("Generate link failed:", linkError);
    return { success: false, error: "Failed to generate invite link." };
  }

  // Send the email directly via Resend
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: emailError } = await resend.emails.send({
    from: "OPM Fingerstyle <noreply@opmfingerstyle.com>",
    to: guitarist.contact_email,
    subject: "Set up your OPM Fingerstyle account",
    html: `
      <h2>Welcome to OPM Fingerstyle!</h2>
      <p>Hi ${guitarist.display_name},</p>
      <p>Your guitarist profile has been approved! Click the link below to set your password and access your dashboard where you can manage your profile, videos, tabs, and social links.</p>
      <p><a href="${linkData.properties.action_link}" style="display:inline-block;background:#D4A017;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600;">Set Your Password</a></p>
      <p>If the button doesn't work, copy and paste this link:<br>${linkData.properties.action_link}</p>
      <p>— OPM Fingerstyle Team</p>
    `,
  });

  if (emailError) {
    console.error("Email send failed:", emailError);
    return { success: false, error: "Failed to send invite email." };
  }

  return { success: true };
}

export async function disableGuitarist(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guitarists")
    .update({ approval_status: "rejected" as const })
    .eq("id", id);

  if (error) {
    console.error("Disable failed:", error);
    return { success: false, error: "Failed to disable guitarist." };
  }

  return { success: true };
}

export async function enableGuitarist(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guitarists")
    .update({ approval_status: "approved" as const })
    .eq("id", id);

  if (error) {
    console.error("Enable failed:", error);
    return { success: false, error: "Failed to enable guitarist." };
  }

  return { success: true };
}
