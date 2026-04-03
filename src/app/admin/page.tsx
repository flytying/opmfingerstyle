import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: gearCount },
    { count: articleCount },
  ] = await Promise.all([
    supabase
      .from("guitarists")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending_review"),
    supabase
      .from("guitarists")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "approved"),
    supabase
      .from("gear_products")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  const stats = [
    {
      label: "Pending Submissions",
      value: pendingCount ?? 0,
      href: "/admin/guitarists?status=pending_review",
      highlight: (pendingCount ?? 0) > 0,
    },
    {
      label: "Approved Guitarists",
      value: approvedCount ?? 0,
      href: "/admin/guitarists?status=approved",
      highlight: false,
    },
    {
      label: "Active Gear Products",
      value: gearCount ?? 0,
      href: "/admin/gear",
      highlight: false,
    },
    {
      label: "Published Articles (Auto)",
      value: articleCount ?? 0,
      href: "/admin",
      highlight: false,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted">Overview of your site content.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${
              stat.highlight
                ? "border-amber-300 bg-amber-50"
                : "border-border bg-background"
            }`}
          >
            <p className="text-sm font-medium text-muted">{stat.label}</p>
            <p
              className={`mt-2 text-3xl font-bold ${
                stat.highlight ? "text-amber-700" : "text-foreground"
              }`}
            >
              {stat.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
