"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Check role and redirect accordingly
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <a href="/forgot-password" className="text-sm text-primary hover:text-primary-hover">
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
