"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "set-password" | "error">("loading");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    // Supabase auto-detects the hash fragment and sets the session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        setStatus("set-password");
      }
    });

    // Also check if already signed in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setStatus("set-password");
    });

    // Timeout fallback
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "error" : prev));
    }, 60 * 60 * 1000); // 60 minutes

    return () => clearTimeout(timeout);
  }, []);

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          <p className="mt-4 text-muted">Verifying your invite...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <p className="text-2xl font-bold text-foreground">Link Expired</p>
          <p className="mt-2 text-muted">
            This invite link may have expired. Please contact us to get a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Set Your Password</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a password to access your OPM Fingerstyle dashboard.
          </p>
        </div>

        <form onSubmit={handleSetPassword} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Setting password..." : "Set Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
