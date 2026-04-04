"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Supabase redirects here with tokens in the hash fragment
    // The Supabase client auto-detects and establishes the session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        // Session established — redirect to set password
        router.replace("/auth/set-password");
      }
    });

    // Also check if session is already set (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/auth/set-password");
      }
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setError(true);
    }, 15000);

    return () => clearTimeout(timeout);
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
