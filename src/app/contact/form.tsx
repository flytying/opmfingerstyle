"use client";

import { useState } from "react";
import { submitContact } from "./actions";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setErrorMessage("");

    const result = await submitContact(formData);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-900">Message Sent!</h2>
        <p className="mt-2 text-green-700">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email *
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
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
