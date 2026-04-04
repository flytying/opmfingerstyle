// Auto-detect genre from video title, song name, and description
// Based on common OPM artists, styles, and keywords

const genreRules: { genre: string; keywords: string[] }[] = [
  {
    genre: "OPM Rock",
    keywords: [
      "eraserheads", "rivermaya", "parokya", "kamikazee", "callalily",
      "bamboo", "hale", "sponge cola", "franco", "urbandub", "sandwich",
      "teeth", "chicosci", "greyhoundz", "razorback", "typecast",
      "silent sanctuary", "6cyclemind", "cueshe", "orange and lemons",
      "itchyworms", "sugarfree", "moonstar88", "cueshé",
    ],
  },
  {
    genre: "OPM Ballad",
    keywords: [
      "apo hiking", "basil valdez", "freddie aguilar", "noel cabangon",
      "gary valenciano", "martin nievera", "regine velasquez", "jed madela",
      "erik santos", "christian bautista", "nina", "kyla", "angeline quinto",
      "morissette", "moira", "paubaya", "torete", "buwan", "mundo",
      "ere", "ikaw", "sana", "wish", "hindi", "mahal",
      "ballad", "love song", "acoustic ballad",
    ],
  },
  {
    genre: "OPM Pop",
    keywords: [
      "iv of spades", "ben&ben", "ben and ben", "sb19", "bgyo",
      "zack tabudlo", "arthur nery", "juan karlos", "dec ave",
      "december avenue", "this band", "iñigo pascual", "james reid",
      "sarah geronimo", "kathniel", "pop", "mainstream",
    ],
  },
  {
    genre: "OPM Classic",
    keywords: [
      "anak", "nang dahil sa iyo", "dahil sa iyo", "bayan ko",
      "pilipinas kong mahal", "freddie aguilar", "asin", "coritha",
      "sampaguita", "apo hiking society", "hotdog", "vst",
      "hagibis", "rey valera", "rico j", "sharon cuneta",
      "classic", "timeless", "iconic",
    ],
  },
  {
    genre: "Folk",
    keywords: [
      "folk", "harana", "kundiman", "visayan", "bisaya", "ilocano",
      "traditional", "rondalla", "asin", "joey ayala", "bayang barrios",
      "grace nono", "bullet dumas", "johnoy danao", "clara benin",
    ],
  },
  {
    genre: "Jazz",
    keywords: [
      "jazz", "bossa nova", "bossa", "swing", "laufey", "smooth",
      "sitti", "mishka adams",
    ],
  },
  {
    genre: "R&B",
    keywords: [
      "r&b", "rnb", "soul", "neo soul", "arthur nery", "sunkissed lola",
      "jroa", "because",
    ],
  },
  {
    genre: "Indie",
    keywords: [
      "indie", "up dharma down", "udd", "autotelic", "munimuni",
      "reese lansangan", "bp valenzuela", "any name's okay",
      "the ransom collective", "tide/edit", "submarine",
    ],
  },
  {
    genre: "Modern",
    keywords: [
      "2024", "2025", "2026", "trending", "viral", "tiktok", "new",
      "latest", "cover",
    ],
  },
];

export function detectGenres(title: string, songName?: string | null, description?: string | null): string[] {
  const text = `${title} ${songName || ""} ${description || ""}`.toLowerCase();
  const detected = new Set<string>();

  for (const rule of genreRules) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        detected.add(rule.genre);
        break;
      }
    }
  }

  // Always add "Fingerstyle" as a base genre
  detected.add("Fingerstyle");

  return Array.from(detected).slice(0, 4); // max 4 genres
}
