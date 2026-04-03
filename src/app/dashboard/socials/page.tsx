import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SocialsManager } from "./manager";

export default async function DashboardSocialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  const { data: socials } = await supabase
    .from("social_links")
    .select("*")
    .eq("guitarist_id", guitarist.id);

  return <SocialsManager guitaristId={guitarist.id} socials={socials || []} />;
}
