import { supabase } from "@/lib/supabase";
import { VERIFIED_PROFILE } from "@/content/verified-content";
import type { Profile } from "@/types/database";

/**
 * There is exactly one public-facing profile row (the site owner's). RLS
 * allows anyone to read it, but only that same admin user can update it.
 */
export async function getPublicProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
    if (error) {
      if (error.code === "PGRST116" || error.code === "42P01") return { ...VERIFIED_PROFILE, id: "verified-profile", role: "admin", avatar_url: null, resume_url: null, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), other_links: [] } as Profile;
      throw error;
    }
    return data ?? ({ ...VERIFIED_PROFILE, id: "verified-profile", role: "admin", avatar_url: null, resume_url: null, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), other_links: [] } as Profile);
  } catch {
    return { ...VERIFIED_PROFILE, id: "verified-profile", role: "admin", avatar_url: null, resume_url: null, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), other_links: [] } as Profile;
  }
}

export async function updateProfile(id: string, input: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
