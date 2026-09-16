import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types/database";

export async function listExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
