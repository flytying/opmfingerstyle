import { describe, it, expect } from "vitest";
import {
  guitaristJsonLd,
  gearProductJsonLd,
  articleJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";
import type { Guitarist, GearProduct, Article } from "@/lib/supabase/types";

const mockGuitarist: Guitarist = {
  id: "123",
  user_id: null,
  slug: "mark-sagato",
  display_name: "Mark Sagato",
  real_name: null,
  location: "Manila",
  bio_short: "Fingerstyle guitarist",
  bio_full: null,
  profile_photo_url: "https://example.com/photo.jpg",
  youtube_channel_url: "https://youtube.com/@mark",
  contact_email: null,
  approval_status: "approved",
  featured: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const mockGear: GearProduct = {
  id: "456",
  slug: "yamaha-fg800",
  name: "Yamaha FG800",
  brand: "Yamaha",
  category: "acoustic_guitar",
  short_description: "Great guitar",
  image_url: "https://example.com/guitar.jpg",
  external_url: "https://yamaha.com",
  affiliate_url: "https://amzn.to/123",
  sponsored: false,
  active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const mockArticle: Article = {
  id: "789",
  slug: "best-guitars",
  title: "Best Guitars for Fingerstyle",
  excerpt: "Our top picks",
  body: "<p>Content</p>",
  featured_image_url: "https://example.com/article.jpg",
  status: "published",
  published_at: "2026-03-15T10:00:00Z",
  created_at: "2026-03-01T00:00:00Z",
  updated_at: "2026-03-15T10:00:00Z",
};

describe("guitaristJsonLd", () => {
  it("returns valid Person schema", () => {
    const result = guitaristJsonLd(mockGuitarist, [
      { external_url: "https://instagram.com/mark" },
    ]);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Person");
    expect(result.name).toBe("Mark Sagato");
    expect(result.url).toContain("/guitarists/mark-sagato");
    expect(result.image).toBe("https://example.com/photo.jpg");
    expect(result.sameAs).toEqual(["https://instagram.com/mark"]);
  });

  it("includes location as address", () => {
    const result = guitaristJsonLd(mockGuitarist, []);
    expect(result.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Manila",
    });
  });

  it("omits address when no location", () => {
    const noLocation = { ...mockGuitarist, location: null };
    const result = guitaristJsonLd(noLocation, []);
    expect(result.address).toBeUndefined();
  });
});

describe("gearProductJsonLd", () => {
  it("returns valid Product schema", () => {
    const result = gearProductJsonLd(mockGear);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Product");
    expect(result.name).toBe("Yamaha FG800");
    expect(result.brand).toEqual({ "@type": "Brand", name: "Yamaha" });
    expect(result.category).toBe("acoustic guitar");
  });

  it("omits brand when null", () => {
    const noBrand = { ...mockGear, brand: null };
    const result = gearProductJsonLd(noBrand);
    expect(result.brand).toBeUndefined();
  });
});

describe("articleJsonLd", () => {
  it("returns valid Article schema", () => {
    const result = articleJsonLd(mockArticle);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Best Guitars for Fingerstyle");
    expect(result.datePublished).toBe("2026-03-15T10:00:00Z");
    expect(result.publisher.name).toBe("OPM Fingerstyle");
  });
});

describe("websiteJsonLd", () => {
  it("returns valid WebSite schema", () => {
    const result = websiteJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("WebSite");
    expect(result.name).toBe("OPM Fingerstyle");
    expect(result.url).toBe("https://opmfingerstyle.com");
  });
});
