import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
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

  // Use service client to check guitarist status (bypasses RLS so we can see disabled accounts)
  const serviceClient = await createServiceClient();
  const { data: guitarist } = await serviceClient
    .from("guitarists")
    .select("display_name, slug, approval_status")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  // Show disabled message
  if (guitarist.approval_status !== "approved") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-900">Account Disabled</h1>
          <p className="mt-3 text-red-700">
            Your account has been temporarily disabled. If you believe this is a
            mistake, please contact us and we&apos;ll look into it.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Contact Us
            </Link>
            <AdminLogout />
          </div>
        </div>
      </div>
    );
  }

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
