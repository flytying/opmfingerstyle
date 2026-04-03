import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Affiliate Disclosure
      </h1>

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
        <p>
          OPM Fingerstyle is a participant in various affiliate programs. This
          means that when you click on certain links on our site and make a
          purchase, we may earn a small commission at no additional cost to you.
        </p>
        <p>
          We only recommend products that we believe are genuinely useful for
          fingerstyle guitarists. Our editorial content and guitarist profiles
          are not influenced by affiliate partnerships.
        </p>
        <p>
          Some products on our gear pages may be marked as &ldquo;Sponsored,&rdquo;
          indicating a paid partnership with the brand. Sponsored content is
          always clearly labeled.
        </p>
        <p>
          If you have questions about our affiliate relationships, please
          contact us at{" "}
          <a
            href="mailto:hello@opmfingerstyle.com"
            className="text-primary hover:text-primary-hover"
          >
            hello@opmfingerstyle.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
