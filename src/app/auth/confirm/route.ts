import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const baseUrl = new URL("/", request.url).origin;
  const redirectUrl = new URL("/auth/set-password", baseUrl);

  // Supabase already verified the token and redirected here with a session
  // Just check if we have a valid session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirectUrl.searchParams.set("error", "expired");
  }

  return NextResponse.redirect(redirectUrl);
}
