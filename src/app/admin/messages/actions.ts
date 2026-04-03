"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleRead(id: string, read: boolean) {
  const supabase = await createClient();
  await supabase.from("contact_submissions").update({ read }).eq("id", id);
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("contact_submissions").delete().eq("id", id);
  return { success: true };
}
