"use server";

import { createClient } from "@/lib/supabase/server";
import type { GearCategory } from "@/lib/supabase/types";

export async function toggleGearActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("gear_products").update({ active }).eq("id", id);
  return { success: true };
}

export async function createGearProduct(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const { error } = await supabase.from("gear_products").insert({
    slug: `${slug}-${Date.now().toString(36)}`,
    name,
    brand: (formData.get("brand") as string) || null,
    category: (formData.get("category") as GearCategory) || "accessory",
    short_description: (formData.get("short_description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    external_url: (formData.get("external_url") as string) || null,
    affiliate_url: (formData.get("affiliate_url") as string) || null,
    sponsored: formData.get("sponsored") === "on",
  });

  if (error) {
    console.error("Create gear failed:", error);
    return { success: false, error: "Failed to create product." };
  }

  return { success: true };
}
