import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const redirectUrl = new URL("/auth/set-password", request.url);

  if (token && type) {
    const supabase = await createClient();

    // Verify the OTP token to establish a session
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as "recovery" | "invite" | "magiclink",
    });

    if (error) {
      console.error("Token verification failed:", error);
      redirectUrl.searchParams.set("error", "expired");
    }
  }

  // Redirect to clean set-password page (no tokens in URL)
  return NextResponse.redirect(redirectUrl);
}
