"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { notifyNewSubmission } from "@/lib/email";

export async function submitProfile(formData: FormData) {
  const displayName = formData.get("display_name") as string;
  const contactEmail = formData.get("contact_email") as string;
  const bioShort = formData.get("bio_short") as string;
  const youtubeChannelUrl = formData.get("youtube_channel_url") as string;
  const location = (formData.get("location") as string) || null;
  const bioFull = (formData.get("bio_full") as string) || null;
  const profilePhotoUrl = (formData.get("profile_photo_url") as string) || null;

  // Validate required fields
  if (!displayName || !contactEmail || !bioShort || !youtubeChannelUrl) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (bioShort.length > 300) {
    return { success: false, error: "Short bio must be 300 characters or less." };
  }

  // Generate unique slug
  const baseSlug = slugify(displayName);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const supabase = await createClient();

  // Check for duplicate email
  const { data: existing } = await supabase
    .from("guitarists")
    .select("id")
    .eq("contact_email", contactEmail)
    .limit(1);

  if (existing && existing.length > 0) {
    return { success: false, error: "A profile with this email already exists." };
  }

  // Insert guitarist (no .select() — anon can't read back pending_review rows)
  const { error: guitaristError } = await supabase
    .from("guitarists")
    .insert({
      slug,
      display_name: displayName,
      contact_email: contactEmail,
      bio_short: bioShort,
      youtube_channel_url: youtubeChannelUrl,
      location,
      bio_full: bioFull,
      profile_photo_url: profilePhotoUrl,
      approval_status: "pending_review",
    });

  if (guitaristError) {
    console.error("Failed to submit profile:", guitaristError);
    return { success: false, error: "Failed to submit profile. Please try again." };
  }

  // Social links will be added by the guitarist after approval via dashboard

  // Notify admin (non-blocking)
  notifyNewSubmission(displayName, contactEmail);

  return { success: true };
}
