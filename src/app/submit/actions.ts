"use server";

import { createClient } from "@/lib/supabase/server";
import type { SocialPlatform } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils";

export async function submitProfile(formData: FormData) {
  const displayName = formData.get("display_name") as string;
  const contactEmail = formData.get("contact_email") as string;
  const bioShort = formData.get("bio_short") as string;
  const youtubeChannelUrl = formData.get("youtube_channel_url") as string;
  const location = (formData.get("location") as string) || null;
  const bioFull = (formData.get("bio_full") as string) || null;

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

  // Insert guitarist
  const { data: guitarist, error: guitaristError } = await supabase
    .from("guitarists")
    .insert({
      slug,
      display_name: displayName,
      contact_email: contactEmail,
      bio_short: bioShort,
      youtube_channel_url: youtubeChannelUrl,
      location,
      bio_full: bioFull,
      approval_status: "pending_review",
    })
    .select("id")
    .single();

  if (guitaristError) {
    console.error("Failed to submit profile:", guitaristError);
    return { success: false, error: "Failed to submit profile. Please try again." };
  }

  // Insert social links
  const rawSocials: { platform: SocialPlatform; url: string | null }[] = [
    { platform: "facebook" as const, url: formData.get("facebook_url") as string | null },
    { platform: "instagram" as const, url: formData.get("instagram_url") as string | null },
    { platform: "tiktok" as const, url: formData.get("tiktok_url") as string | null },
    { platform: "youtube" as const, url: youtubeChannelUrl },
  ];
  const socialLinks = rawSocials.filter((s): s is { platform: SocialPlatform; url: string } => !!s.url);

  if (socialLinks.length > 0 && guitarist) {
    await supabase.from("social_links").insert(
      socialLinks.map((s) => ({
        guitarist_id: guitarist.id,
        platform: s.platform,
        external_url: s.url,
      }))
    );
  }

  return { success: true };
}
