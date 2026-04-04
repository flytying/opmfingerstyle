"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const dashNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/videos", label: "Videos" },
  { href: "/dashboard/tabs", label: "Tabs" },
  { href: "/dashboard/socials", label: "Social Links" },
];

export function DashboardNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
      {dashNav.map((item) => {
        const isActive = item.href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted hover:border-gray-300 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
