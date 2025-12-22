import { supabase } from "@/services/supabase";

/**
 * Saves or updates a user's portfolio.
 * - Enforces unique username
 * - Stores portfolio data as JSONB
 */
export async function savePortfolio(
  userId: string,
  username: string,
  data: any
) {
  if (!userId) throw new Error("userId is required");
  if (!username) throw new Error("username is required");

  // normalize username
  const normalized = String(username).toLowerCase().trim();

  // check if username already exists for another user
  const { data: existing, error: selectErr } = await supabase
    .from("portfolios")
    .select("id, user_id")
    .eq("username", normalized)
    .maybeSingle();

  if (selectErr) {
    console.error("savePortfolio select error:", selectErr);
    throw selectErr;
  }

  if (existing && existing.user_id !== userId) {
    throw new Error("Username already taken by another user");
  }

  // upsert portfolio (matches DB column name: `data`)
  const { data: saved, error: upsertErr } = await supabase
    .from("portfolios")
    .upsert(
      {
        user_id: userId,
        username: normalized,
        data, // ✅ MUST be `data`, not `state`
      },
      { onConflict: "username" }
    )
    .select()
    .single();

  if (upsertErr) {
    console.error("savePortfolio upsert error:", upsertErr);
    throw upsertErr;
  }

  return saved;
}

export default { savePortfolio };
