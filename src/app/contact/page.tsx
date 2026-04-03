import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the OPM Fingerstyle team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Contact Us
      </h1>
      <p className="mt-4 text-lg text-muted">
        Have questions, feedback, or want to collaborate? We&apos;d love to hear
        from you.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground">General Inquiries</h2>
          <p className="mt-2 text-muted">
            For general questions or feedback, email us at{" "}
            <a
              href="mailto:hello@opmfingerstyle.com"
              className="font-medium text-primary hover:text-primary-hover"
            >
              hello@opmfingerstyle.com
            </a>
          </p>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground">Partnerships & Sponsorships</h2>
          <p className="mt-2 text-muted">
            Interested in featuring your products or collaborating with us?
            Reach out at{" "}
            <a
              href="mailto:partners@opmfingerstyle.com"
              className="font-medium text-primary hover:text-primary-hover"
            >
              partners@opmfingerstyle.com
            </a>
          </p>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground">Profile Issues</h2>
          <p className="mt-2 text-muted">
            Need to update or remove your profile? Email us at{" "}
            <a
              href="mailto:support@opmfingerstyle.com"
              className="font-medium text-primary hover:text-primary-hover"
            >
              support@opmfingerstyle.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
