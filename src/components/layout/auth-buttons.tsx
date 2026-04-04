import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";

interface Props {
  navLinks: { href: string; label: string }[];
}

export async function AuthButtons({ navLinks }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, display_name")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
    displayName = profile?.display_name ?? null;
  }

  return (
    <>
      {!user && (
        <Link
          href="/submit"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Submit Profile
        </Link>
      )}
      {user ? (
        <div className="hidden sm:block">
          <UserMenu
            email={user.email || ""}
            displayName={displayName}
            role={role || "guitarist"}
          />
        </div>
      ) : (
        <Link
          href="/login"
          className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-foreground hover:text-foreground sm:inline-flex"
        >
          Log In
        </Link>
      )}
      <MobileMenu navLinks={navLinks} user={user} role={role} />
    </>
  );
}
