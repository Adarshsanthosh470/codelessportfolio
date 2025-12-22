import { supabase } from "@/services/supabase";

export async function getPortfolioByUsername(username: string) {
  const { data, error } = await supabase
    .from("portfolios")
    .select("data")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("getPortfolioByUsername error:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Portfolio not found");
  }

  return data.data;
}
