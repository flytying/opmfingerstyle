"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function handleAuth() {
      // Parse hash fragment manually
      const hash = window.location.hash.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            // Clear the hash from URL before redirecting
            window.history.replaceState(null, "", "/auth/confirm");
            router.replace("/auth/set-password");
            return;
          }
          console.error("Set session failed:", error.message);
        }
      }

      // Check query params for code (PKCE flow)
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace("/auth/set-password");
          return;
        }
        console.error("Code exchange failed:", error.message);
      }

      // Check if session already exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/auth/set-password");
        return;
      }

      // Nothing worked — show error after delay
      setTimeout(() => setError(true), 5000);
    }

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <p className="text-2xl font-bold text-foreground">Link Expired</p>
          <p className="mt-2 text-muted">
            This invite link has expired or has already been used. Please contact us to get a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        <p className="mt-4 text-muted">Setting up your account...</p>
      </div>
    </div>
  );
}
