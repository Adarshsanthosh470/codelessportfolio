import { supabase } from "@/services/supabase";

function todayIsoDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export async function canDeploy(userId: string): Promise<boolean> {
  if (!userId) return false;

  const deploy_date = todayIsoDate();

  const { data, error } = await supabase
    .from("deploy_logs")
    .select("count")
    .eq("user_id", userId)
    .eq("deploy_date", deploy_date)
    .maybeSingle();

  if (error) {
    console.error("canDeploy query error:", error);
    return false;
  }

  // ✅ THIS IS CORRECT
  if (!data) return true;

  return data.count < 2;
}

export async function incrementDeploy(userId: string): Promise<boolean> {
  if (!userId) return false;

  const deploy_date = todayIsoDate();

  const { data, error } = await supabase
    .from("deploy_logs")
    .select("user_id, deploy_date, count")
    .eq("user_id", userId)
    .eq("deploy_date", deploy_date)
    .maybeSingle();

  if (error) {
    console.error("incrementDeploy select error:", error);
    return false;
  }

  if (!data) {
    const { error: insertErr } = await supabase
      .from("deploy_logs")
      .insert([{ user_id: userId, deploy_date, count: 1 }]);

    if (insertErr) {
      console.error("incrementDeploy insert error:", insertErr);
      return false;
    }
    return true;
  }

  const { error: updateErr } = await supabase
    .from("deploy_logs")
    .update({ count: data.count + 1 })
    .eq("user_id", userId)
    .eq("deploy_date", deploy_date);

  if (updateErr) {
    console.error("incrementDeploy update error:", updateErr);
    return false;
  }

  return true;
}
