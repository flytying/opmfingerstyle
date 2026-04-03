import type { Guitarist, GearProduct, Article } from "@/lib/supabase/types";

const BASE_URL = "https://opmfingerstyle.com";

export function guitaristJsonLd(guitarist: Guitarist, socials: { external_url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guitarist.display_name,
    description: guitarist.bio_short,
    url: `${BASE_URL}/guitarists/${guitarist.slug}`,
    image: guitarist.profile_photo_url || undefined,
    jobTitle: "Fingerstyle Guitarist",
    ...(guitarist.location && { address: { "@type": "PostalAddress", addressLocality: guitarist.location } }),
    sameAs: socials.map((s) => s.external_url),
  };
}

export function gearProductJsonLd(product: GearProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || `${product.name} for fingerstyle guitarists`,
    url: `${BASE_URL}/gear/${product.slug}`,
    image: product.image_url || undefined,
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    category: product.category.replace(/_/g, " "),
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || undefined,
    url: `${BASE_URL}/blog/${article.slug}`,
    image: article.featured_image_url || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at,
    publisher: {
      "@type": "Organization",
      name: "OPM Fingerstyle",
      url: BASE_URL,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OPM Fingerstyle",
    url: BASE_URL,
    description: "Discover talented Filipino fingerstyle guitarists performing OPM songs.",
  };
}
