import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  const [{ count: videoCount }, { count: tabCount }, { count: socialCount }] =
    await Promise.all([
      supabase.from("guitarist_videos").select("*", { count: "exact", head: true }).eq("guitarist_id", guitarist.id),
      supabase.from("tablature_links").select("*", { count: "exact", head: true }).eq("guitarist_id", guitarist.id),
      supabase.from("social_links").select("*", { count: "exact", head: true }).eq("guitarist_id", guitarist.id),
    ]);

  const cards = [
    { label: "Videos", count: videoCount ?? 0, href: "/dashboard/videos" },
    { label: "Tabs", count: tabCount ?? 0, href: "/dashboard/tabs" },
    { label: "Social Links", count: socialCount ?? 0, href: "/dashboard/socials" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
