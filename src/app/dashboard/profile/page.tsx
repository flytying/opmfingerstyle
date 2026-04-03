import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "./form";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  return <ProfileEditForm guitarist={guitarist} />;
}
