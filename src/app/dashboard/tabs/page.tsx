import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TabsManager } from "./manager";

export default async function DashboardTabsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  const { data: tabs } = await supabase
    .from("tablature_links")
    .select("*")
    .eq("guitarist_id", guitarist.id)
    .order("created_at", { ascending: false });

  return <TabsManager guitaristId={guitarist.id} tabs={tabs || []} />;
}
