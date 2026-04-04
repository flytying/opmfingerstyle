import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase token types map differently for verifyOtp
const otpTypeMap: Record<string, string> = {
  invite: "signup",
  recovery: "recovery",
  magiclink: "magiclink",
  signup: "signup",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token_hash") || searchParams.get("token");
  const type = searchParams.get("type") || "recovery";

  const baseUrl = new URL("/", request.url).origin;
  const redirectUrl = new URL("/auth/set-password", baseUrl);

  if (token) {
    const supabase = await createClient();
    const otpType = otpTypeMap[type] || "recovery";

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: otpType as "recovery" | "signup" | "magiclink",
    });

    if (error) {
      console.error("Token verification failed:", error.message, "| type:", type, "→", otpType);
      redirectUrl.searchParams.set("error", "expired");
    }
  } else {
    redirectUrl.searchParams.set("error", "expired");
  }

  return NextResponse.redirect(redirectUrl);
}
