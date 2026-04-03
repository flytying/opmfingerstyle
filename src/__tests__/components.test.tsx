import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GuitaristCard } from "@/components/ui/guitarist-card";
import { ArticleCard } from "@/components/ui/article-card";
import { GearCard } from "@/components/ui/gear-card";

describe("GuitaristCard", () => {
  const guitarist = {
    slug: "mark-sagato",
    display_name: "Mark Sagato",
    location: "Manila",
    bio_short: "Great fingerstyle guitarist",
    profile_photo_url: null,
  };

  it("renders guitarist name", () => {
    render(<GuitaristCard guitarist={guitarist} />);
    expect(screen.getByText("Mark Sagato")).toBeInTheDocument();
  });

  it("renders location", () => {
    render(<GuitaristCard guitarist={guitarist} />);
    expect(screen.getByText("Manila")).toBeInTheDocument();
  });

  it("renders bio", () => {
    render(<GuitaristCard guitarist={guitarist} />);
    expect(screen.getByText("Great fingerstyle guitarist")).toBeInTheDocument();
  });

  it("links to profile page", () => {
    render(<GuitaristCard guitarist={guitarist} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/guitarists/mark-sagato");
  });

  it("hides location when null", () => {
    render(<GuitaristCard guitarist={{ ...guitarist, location: null }} />);
    expect(screen.queryByText("Manila")).not.toBeInTheDocument();
  });

  it("shows placeholder when no photo", () => {
    const { container } = render(<GuitaristCard guitarist={guitarist} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("ArticleCard", () => {
  const article = {
    slug: "best-guitars",
    title: "Best Guitars",
    excerpt: "Our top picks for fingerstyle",
    featured_image_url: null,
    published_at: "2026-03-15T10:00:00Z",
  };

  it("renders article title", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("Best Guitars")).toBeInTheDocument();
  });

  it("renders excerpt", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("Our top picks for fingerstyle")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("March 15, 2026")).toBeInTheDocument();
  });

  it("links to blog post", () => {
    render(<ArticleCard article={article} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/best-guitars");
  });

  it("hides date when null", () => {
    render(<ArticleCard article={{ ...article, published_at: null }} />);
    expect(screen.queryByText("March 15, 2026")).not.toBeInTheDocument();
  });
});

describe("GearCard", () => {
  const product = {
    slug: "yamaha-fg800",
    name: "Yamaha FG800",
    brand: "Yamaha",
    category: "acoustic_guitar" as const,
    short_description: "Great guitar for beginners",
    image_url: null,
    sponsored: false,
  };

  it("renders product name", () => {
    render(<GearCard product={product} />);
    expect(screen.getByText("Yamaha FG800")).toBeInTheDocument();
  });

  it("renders brand and category", () => {
    render(<GearCard product={product} />);
    expect(screen.getByText(/Yamaha · Acoustic Guitar/)).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<GearCard product={product} />);
    expect(screen.getByText("Great guitar for beginners")).toBeInTheDocument();
  });

  it("links to gear detail page", () => {
    render(<GearCard product={product} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/gear/yamaha-fg800");
  });

  it("shows sponsored badge when sponsored", () => {
    render(<GearCard product={{ ...product, sponsored: true }} />);
    expect(screen.getByText("Sponsored")).toBeInTheDocument();
  });

  it("hides sponsored badge when not sponsored", () => {
    render(<GearCard product={product} />);
    expect(screen.queryByText("Sponsored")).not.toBeInTheDocument();
  });
});
