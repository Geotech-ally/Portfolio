import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

/**
 * There is exactly one public-facing profile row (the site owner's). RLS
 * allows anyone to read it, but only that same admin user can update it.
 */
export async function getPublicProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, input: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
