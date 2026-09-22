import { supabase } from "@/lib/supabase";
import { VERIFIED_TRAINING_RECORDS } from "@/content/verified-content";
import type { Certification } from "@/types/database";

export async function listCertifications(): Promise<Certification[]> {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      if (error.code === "42P01") {
        return VERIFIED_TRAINING_RECORDS.map((item, index) => ({
          id: `training-${index}`,
          name: item.name,
          issuer: item.issuer,
          issue_date: new Date().toISOString(),
          credential_id: null,
          credential_url: null,
          certificate_asset_path: null,
          description: item.description,
          sort_order: index + 1,
          created_at: new Date().toISOString(),
        }));
      }
      throw error;
    }
    return data ?? [];
  } catch {
    return VERIFIED_TRAINING_RECORDS.map((item, index) => ({
      id: `training-${index}`,
      name: item.name,
      issuer: item.issuer,
      issue_date: new Date().toISOString(),
      credential_id: null,
      credential_url: null,
      certificate_asset_path: null,
      description: item.description,
      sort_order: index + 1,
      created_at: new Date().toISOString(),
    }));
  }
}
