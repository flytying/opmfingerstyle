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
    </div>
  );
}
