import { supabase } from "@/lib/supabase";
import type { Certification } from "@/types/database";

export async function listCertifications(): Promise<Certification[]> {
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
