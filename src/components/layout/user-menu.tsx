"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  email: string;
  displayName: string | null;
  role: string;
}

export function UserMenu({ email, displayName, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const initial = (displayName || email)[0].toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white transition-opacity hover:opacity-80"
        aria-label="User menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-background py-2 shadow-lg">
          <div className="border-b border-border px-4 pb-2">
            <p className="text-sm font-medium text-foreground">{displayName || "User"}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>

          <div className="py-1">
            <Link
              href={role === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-foreground hover:bg-surface"
            >
              {role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>
            {role === "admin" && (
              <Link
                href="/admin/guitarists"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-foreground hover:bg-surface"
              >
                Manage Guitarists
              </Link>
            )}
            {role !== "admin" && (
              <>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-surface"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-surface"
                >
                  Settings
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-border pt-1">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-surface"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
