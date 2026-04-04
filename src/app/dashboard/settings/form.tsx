"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateEmail, updatePassword } from "./actions";

export function SettingsForm({ email }: { email: string }) {
  const router = useRouter();
  const [emailMsg, setEmailMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleEmail(formData: FormData) {
    setSavingEmail(true);
    setEmailMsg("");
    const result = await updateEmail(formData);
    setSavingEmail(false);
    setEmailMsg(result.success ? "Confirmation email sent to your new address. Check your inbox." : (result.error || "Failed."));
  }

  async function handlePassword(formData: FormData) {
    setSavingPassword(true);
    setPasswordMsg("");
    const result = await updatePassword(formData);
    setSavingPassword(false);
    if (result.success) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
      return;
    }
    setPasswordMsg(result.error || "Failed.");
  }

  return (
    <div className="space-y-8">
      {/* Change Email */}
      <form action={handleEmail} className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">Email Address</h2>
        <p className="mt-1 text-sm text-muted">
          Update your email address. A confirmation will be sent to the new email.
        </p>
        {emailMsg && (
          <div className={`mt-3 rounded-lg border p-2 text-sm ${emailMsg.includes("sent") || emailMsg.includes("Confirmation") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {emailMsg}
          </div>
        )}
        <div className="mt-4 max-w-md">
          <label className="block text-sm font-medium text-foreground">Current Email</label>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        <div className="mt-4 max-w-md">
          <label htmlFor="new_email" className="block text-sm font-medium text-foreground">New Email</label>
          <input
            type="email"
            id="new_email"
            name="new_email"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="your-new@email.com"
          />
        </div>
        <button
          type="submit"
          disabled={savingEmail}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {savingEmail ? "Updating..." : "Update Email"}
        </button>
      </form>

      {/* Change Password */}
      <form action={handlePassword} className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">Password</h2>
        <p className="mt-1 text-sm text-muted">
          Change your account password.
        </p>
        {passwordMsg && (
          <div className={`mt-3 rounded-lg border p-2 text-sm ${passwordMsg.includes("updated") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {passwordMsg}
          </div>
        )}
        <div className="mt-4 max-w-md">
          <label htmlFor="new_password" className="block text-sm font-medium text-foreground">New Password</label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="At least 8 characters"
          />
        </div>
        <div className="mt-4 max-w-md">
          <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground">Confirm New Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Repeat new password"
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {savingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
