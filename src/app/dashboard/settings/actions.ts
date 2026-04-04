"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateEmail(formData: FormData) {
  const newEmail = formData.get("new_email") as string;
  if (!newEmail) return { success: false, error: "Email is required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    console.error("Email update failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Password update failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
