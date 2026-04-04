"use client";

import { usePathname } from "next/navigation";

export function HeaderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanel = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <div className={`flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 ${isPanel ? "" : "mx-auto max-w-7xl"}`}>
      {children}
    </div>
  );
}
