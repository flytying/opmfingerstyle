"use client";

import { useState } from "react";
import { submitProfile } from "./actions";

export function SubmitProfileForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setErrorMessage("");

    const result = await submitProfile(formData);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-900">Profile Submitted!</h2>
        <p className="mt-2 text-green-700">
          Thank you for submitting your profile. We&apos;ll review it and get back to
          you soon. Once approved, you&apos;ll receive an email to set up your account.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Required Fields */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">
          Required Information
        </legend>

        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-foreground">
            Display Name *
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            required
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Your artist/stage name"
          />
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-foreground">
            Email Address *
          </label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            required
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="your@email.com"
          />
          <p className="mt-1 text-xs text-muted">
            Used to create your account upon approval. Not displayed publicly.
          </p>
        </div>

        <div>
          <label htmlFor="bio_short" className="block text-sm font-medium text-foreground">
            Short Bio *
          </label>
          <textarea
            id="bio_short"
            name="bio_short"
            required
            rows={3}
            maxLength={300}
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Tell us about yourself and your music (max 300 characters)"
          />
        </div>

        <div>
          <label htmlFor="youtube_channel_url" className="block text-sm font-medium text-foreground">
            YouTube Channel or Video URL *
          </label>
          <input
            type="url"
            id="youtube_channel_url"
            name="youtube_channel_url"
            required
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://youtube.com/@yourchannel"
          />
        </div>
      </fieldset>

      {/* Optional Fields */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">
          Optional Information
        </legend>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="City, Province"
          />
        </div>

        <div>
          <label htmlFor="bio_full" className="block text-sm font-medium text-foreground">
            Full Bio
          </label>
          <textarea
            id="bio_full"
            name="bio_full"
            rows={5}
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Share your story, influences, and journey with fingerstyle guitar"
          />
        </div>

        <div>
          <label htmlFor="facebook_url" className="block text-sm font-medium text-foreground">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebook_url"
            name="facebook_url"
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div>
          <label htmlFor="instagram_url" className="block text-sm font-medium text-foreground">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagram_url"
            name="instagram_url"
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        <div>
          <label htmlFor="tiktok_url" className="block text-sm font-medium text-foreground">
            TikTok URL
          </label>
          <input
            type="url"
            id="tiktok_url"
            name="tiktok_url"
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://tiktok.com/@yourhandle"
          />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Submit Profile for Review"}
      </button>
    </form>
  );
}
