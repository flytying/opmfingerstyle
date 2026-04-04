import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddVideoForm } from "./form";

export default async function AddVideoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Add New Video</h2>
      <p className="mt-1 text-sm text-muted">Add a YouTube video to your profile.</p>
      <AddVideoForm guitaristId={guitarist.id} />
    </div>
  );
}
