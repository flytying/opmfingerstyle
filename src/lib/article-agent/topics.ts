export interface Topic {
  id: string;
  name: string;
  searchQueries: string[];
  guidance: string;
  unsplashKeywords: string;
}

export const topics: Topic[] = [
  {
    id: "trending-arrangements",
    name: "Best OPM Fingerstyle Arrangements",
    searchQueries: [
      "best OPM fingerstyle guitar covers 2026",
      "trending Filipino fingerstyle guitar arrangements",
      "new OPM acoustic guitar covers YouTube",
    ],
    guidance:
      "Write about the best and trending OPM fingerstyle guitar arrangements. Highlight specific songs and artists. Include what makes each arrangement special — technique, creativity, emotion. Target guitarists looking for inspiration.",
    unsplashKeywords: "acoustic guitar performance",
  },
  {
    id: "technique-tips",
    name: "Fingerstyle Technique Tips",
    searchQueries: [
      "fingerstyle guitar technique tips for beginners",
      "advanced fingerstyle guitar techniques acoustic",
      "fingerpicking patterns OPM songs guitar",
    ],
    guidance:
      "Write practical technique tips for fingerstyle guitarists. Cover specific techniques like Travis picking, percussive slaps, harmonics, or thumb independence. Relate techniques to OPM songs where possible. Target intermediate players looking to level up.",
    unsplashKeywords: "guitar hands close up",
  },
  {
    id: "gear-recommendations",
    name: "Gear Reviews & Recommendations",
    searchQueries: [
      "best acoustic guitar for fingerstyle Philippines",
      "fingerstyle guitar accessories strings capo review",
      "affordable recording gear acoustic guitar home studio",
    ],
    guidance:
      "Write about gear relevant to fingerstyle guitarists — guitars, strings, capos, pickups, recording equipment. Focus on products available in the Philippines or easily ordered online. Include price ranges in PHP when possible. Target players looking to upgrade.",
    unsplashKeywords: "acoustic guitar gear strings",
  },
  {
    id: "guitarist-spotlight",
    name: "Filipino Guitarist Spotlights",
    searchQueries: [
      "Filipino fingerstyle guitarist YouTube",
      "Pinoy acoustic guitar artist spotlight",
      "emerging Filipino guitar players 2026",
    ],
    guidance:
      "Write a spotlight feature on notable Filipino fingerstyle guitarists. Discuss their style, signature arrangements, journey, and what makes them stand out. Celebrate the Filipino fingerstyle community. Target music fans and fellow guitarists.",
    unsplashKeywords: "guitarist portrait performance",
  },
  {
    id: "song-deep-dives",
    name: "OPM Song Deep Dives",
    searchQueries: [
      "classic OPM songs history behind the music",
      "OPM love songs guitar arrangement analysis",
      "iconic Filipino songs musical analysis",
    ],
    guidance:
      "Write a deep dive into a specific OPM song or group of songs — their history, cultural significance, musical structure, and why they translate well to fingerstyle guitar. Target music lovers and guitarists who want to understand the music beyond just playing it.",
    unsplashKeywords: "music notes vintage Filipino",
  },
  {
    id: "beginner-guide",
    name: "Beginner OPM Fingerstyle Guide",
    searchQueries: [
      "easy OPM songs fingerstyle guitar beginner",
      "how to start fingerstyle guitar Filipino songs",
      "simple fingerpicking songs for beginners OPM",
    ],
    guidance:
      "Write a beginner-friendly guide to learning OPM songs on fingerstyle guitar. Suggest specific easy songs, explain basic patterns, and give encouragement. Keep it accessible and motivating. Target complete beginners or acoustic players transitioning to fingerstyle.",
    unsplashKeywords: "learning guitar beginner acoustic",
  },
  {
    id: "guitar-maintenance",
    name: "Guitar Maintenance & Care",
    searchQueries: [
      "guitar maintenance tips tropical climate humidity",
      "acoustic guitar care Philippines weather",
      "how to maintain guitar strings fretboard",
    ],
    guidance:
      "Write about guitar maintenance with a focus on tropical climate challenges common in the Philippines — humidity, heat, storage. Cover string changes, fretboard care, humidity control, and storage tips. Target guitar owners who want to protect their instrument.",
    unsplashKeywords: "guitar workshop maintenance wood",
  },
  {
    id: "music-scene-news",
    name: "Philippine Music Scene News",
    searchQueries: [
      "Philippine music scene news 2026",
      "OPM music events concerts Philippines",
      "Filipino music industry updates acoustic",
    ],
    guidance:
      "Write about recent happenings in the Philippine music scene — events, new releases, festivals, collaborations, or community milestones relevant to acoustic/fingerstyle guitarists. Keep it current and community-focused. Target the OPM music community.",
    unsplashKeywords: "music concert Philippines stage",
  },
];

export function getWeeklyTopic(): Topic {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return topics[weekNumber % topics.length];
}
