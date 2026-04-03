import type { Metadata } from "next";
import { ContactForm } from "./form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the OPM Fingerstyle team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Contact Us
      </h1>
      <p className="mt-4 text-lg text-muted">
        Have questions, feedback, or want to collaborate? Send us a message
        and we&apos;ll get back to you.
      </p>

      <ContactForm />

      <div className="mt-12 space-y-4">
        <div className="rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground">Partnerships & Sponsorships</h2>
          <p className="mt-2 text-muted">
            Interested in featuring your products or collaborating with us? Reach out at{" "}
            <a
              href="mailto:hello@opmfingerstyle.com"
              className="font-medium text-primary hover:text-primary-hover"
            >
              hello@opmfingerstyle.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
