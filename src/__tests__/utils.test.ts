import { describe, it, expect } from "vitest";
import {
  slugify,
  getYouTubeId,
  getYouTubeThumbnail,
  formatDate,
  categoryLabels,
} from "@/lib/utils";

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Mark Sagato")).toBe("mark-sagato");
  });

  it("removes special characters", () => {
    expect(slugify("JM's Guitàr!")).toBe("jms-guitr");
  });

  it("collapses multiple spaces and dashes", () => {
    expect(slugify("hello   world---test")).toBe("hello-world-test");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("getYouTubeId", () => {
  it("extracts ID from standard watch URL", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("extracts ID from youtu.be short URL", () => {
    expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from embed URL", () => {
    expect(
      getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from shorts URL", () => {
    expect(
      getYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from URL with extra params", () => {
    expect(
      getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s")
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns null for non-YouTube URL", () => {
    expect(getYouTubeId("https://example.com/video")).toBeNull();
  });

  it("returns null for YouTube channel URL", () => {
    expect(getYouTubeId("https://youtube.com/@somechannel")).toBeNull();
  });
});

describe("getYouTubeThumbnail", () => {
  it("returns thumbnail URL for valid video", () => {
    expect(
      getYouTubeThumbnail("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg");
  });

  it("returns null for invalid URL", () => {
    expect(getYouTubeThumbnail("https://example.com")).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats ISO date to readable string", () => {
    expect(formatDate("2026-03-15T10:00:00Z")).toBe("March 15, 2026");
  });

  it("handles date-only string", () => {
    const result = formatDate("2026-01-01");
    expect(result).toContain("2026");
    expect(result).toContain("January");
  });
});

describe("categoryLabels", () => {
  it("has labels for all gear categories", () => {
    expect(categoryLabels["acoustic_guitar"]).toBe("Acoustic Guitars");
    expect(categoryLabels["strings"]).toBe("Strings");
    expect(categoryLabels["audio_interface"]).toBe("Audio Interfaces");
  });

  it("has 12 categories", () => {
    expect(Object.keys(categoryLabels)).toHaveLength(12);
  });
});
