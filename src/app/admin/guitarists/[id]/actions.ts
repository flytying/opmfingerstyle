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

  // Create auth user via service role (sends invite)
  const { data: authUser, error: authError } = await serviceClient.auth.admin.inviteUserByEmail(
    guitarist.contact_email,
    {
      data: {
        role: "guitarist",
        display_name: guitarist.display_name,
      },
      redirectTo: "https://opmfingerstyle.com/auth/confirm",
    }
  );

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

  const { error } = await serviceClient.auth.admin.inviteUserByEmail(
    guitarist.contact_email,
    {
      data: {
        role: "guitarist",
        display_name: guitarist.display_name,
      },
      redirectTo: "https://opmfingerstyle.com/auth/confirm",
    }
  );

  if (error) {
    console.error("Resend invite failed:", error);
    return { success: false, error: `Failed to resend invite: ${error.message}` };
  }

  return { success: true };
}
