"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("sending");
    setError("");
    const result = await requestPasswordReset(formData);
    if (result.success) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-medium text-green-900">Check your email</p>
        <p className="mt-1 text-sm text-green-700">
          If an account exists with that email, you&apos;ll receive a password reset link shortly.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-4">
      {status === "error" && (
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="your@email.com"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Log In
        </Link>
      </p>
    </form>
  );
}
