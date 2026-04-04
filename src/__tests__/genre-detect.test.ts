import { describe, it, expect } from "vitest";
import { detectGenres } from "@/lib/genre-detect";

describe("detectGenres", () => {
  it("always includes Fingerstyle", () => {
    const genres = detectGenres("Some random title");
    expect(genres).toContain("Fingerstyle");
  });

  it("detects OPM Rock from Eraserheads", () => {
    const genres = detectGenres("Huling El Bimbo - Eraserheads Fingerstyle Cover");
    expect(genres).toContain("OPM Rock");
    expect(genres).toContain("Fingerstyle");
  });

  it("detects OPM Ballad from keywords", () => {
    const genres = detectGenres("Paubaya - Moira Dela Torre Guitar Cover");
    expect(genres).toContain("OPM Ballad");
  });

  it("detects OPM Pop from IV of Spades", () => {
    const genres = detectGenres("Mundo - IV of Spades Fingerstyle");
    expect(genres).toContain("OPM Pop");
  });

  it("detects OPM Classic from Freddie Aguilar", () => {
    const genres = detectGenres("Anak - Freddie Aguilar Cover");
    expect(genres).toContain("OPM Classic");
  });

  it("detects Jazz from keywords", () => {
    const genres = detectGenres("Bossa Nova Guitar Arrangement");
    expect(genres).toContain("Jazz");
  });

  it("detects Folk from keywords", () => {
    const genres = detectGenres("Traditional Kundiman Harana Guitar");
    expect(genres).toContain("Folk");
  });

  it("detects Indie from Up Dharma Down", () => {
    const genres = detectGenres("Tadhana - Up Dharma Down Cover");
    expect(genres).toContain("Indie");
  });

  it("detects Modern from cover keyword", () => {
    const genres = detectGenres("Latest OPM Guitar Cover 2026");
    expect(genres).toContain("Modern");
  });

  it("detects multiple genres", () => {
    const genres = detectGenres("Eraserheads Medley - Classic OPM Rock Cover");
    expect(genres).toContain("OPM Rock");
    expect(genres).toContain("OPM Classic");
    expect(genres).toContain("Modern");
    expect(genres).toContain("Fingerstyle");
  });

  it("uses song name for detection", () => {
    const genres = detectGenres("Guitar Cover", "Anak");
    expect(genres).toContain("OPM Classic");
  });

  it("uses description for detection", () => {
    const genres = detectGenres("Guitar Arrangement", null, "A jazz-inspired bossa nova arrangement");
    expect(genres).toContain("Jazz");
  });

  it("limits to 4 genres max", () => {
    const genres = detectGenres("Eraserheads Classic OPM Rock Ballad Folk Jazz Cover 2026");
    expect(genres.length).toBeLessThanOrEqual(4);
  });

  it("handles empty inputs", () => {
    const genres = detectGenres("");
    expect(genres).toContain("Fingerstyle");
    expect(genres.length).toBe(1);
  });

  it("is case insensitive", () => {
    const genres = detectGenres("ERASERHEADS FINGERSTYLE");
    expect(genres).toContain("OPM Rock");
  });
});
