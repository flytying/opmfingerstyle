import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons } from "./auth-buttons";

const navLinks = [
  { href: "/guitarists", label: "Guitarists" },
  { href: "/videos", label: "Videos" },
  { href: "/tabs", label: "Tabs" },
  { href: "/gear", label: "Gear" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            OPM<span className="text-primary">Fingerstyle</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Suspense fallback={<AuthButtonsFallback />}>
            <AuthButtons navLinks={navLinks} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function AuthButtonsFallback() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-28 animate-pulse rounded-full bg-gray-100" />
      <div className="hidden h-9 w-20 animate-pulse rounded-full bg-gray-100 sm:block" />
    </div>
  );
}
