import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });

import { createClient } from "@supabase/supabase-js";
import { detectGenres } from "../src/lib/genre-detect";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: videos } = await supabase.from("guitarist_videos").select("id, title, description");

  for (const v of videos || []) {
    const genre = detectGenres(v.title || "", null, v.description);
    await supabase.from("guitarist_videos").update({ genre }).eq("id", v.id);
    console.log(v.title, "→", genre.join(", "));
  }

  console.log(`\nUpdated ${videos?.length} videos`);
}

main();
