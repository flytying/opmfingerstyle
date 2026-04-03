import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: April 2026</p>

      <div className="mt-8 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Information We Collect
          </h2>
          <p className="mt-3">
            When you submit a profile, we collect your display name, email
            address, bio, location, social media links, and YouTube
            channel/video URLs. We also collect standard analytics data through
            cookies and third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <p className="mt-3">
            Your submitted information is used to create and maintain your
            public guitarist profile. Email addresses are used for account
            management and communication about your profile. Analytics data
            helps us improve the site experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p className="mt-3">
            We use Google AdSense for advertising, which may use cookies to
            serve ads based on your browsing history. We also embed YouTube
            videos, which are subject to Google&apos;s privacy policy. Affiliate
            links may redirect through third-party tracking services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Your Rights
          </h2>
          <p className="mt-3">
            You can request to view, update, or delete your personal information
            at any time by contacting us at{" "}
            <a
              href="mailto:support@opmfingerstyle.com"
              className="text-primary hover:text-primary-hover"
            >
              support@opmfingerstyle.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-3">
            For privacy-related inquiries, email{" "}
            <a
              href="mailto:support@opmfingerstyle.com"
              className="text-primary hover:text-primary-hover"
            >
              support@opmfingerstyle.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
