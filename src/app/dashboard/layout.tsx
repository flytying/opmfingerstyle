import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLogout } from "../admin/logout-button";

const dashNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/videos", label: "Videos" },
  { href: "/dashboard/tabs", label: "Tabs" },
  { href: "/dashboard/socials", label: "Social Links" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("display_name, slug")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {guitarist.display_name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your profile and content.{" "}
            <Link href={`/guitarists/${guitarist.slug}`} className="text-primary hover:text-primary-hover">
              View public profile &rarr;
            </Link>
          </p>
        </div>
        <AdminLogout />
      </div>

      {/* Tabs navigation */}
      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {dashNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-gray-300 hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
