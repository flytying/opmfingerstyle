"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewContactMessage } from "@/lib/email";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Please fill in all fields." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    console.error("Contact submission failed:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }

  // Notify admin (non-blocking)
  notifyNewContactMessage(name, subject);

  return { success: true };
}
