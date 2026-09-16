import { supabase } from "@/lib/supabase";
import type { SecurityWriteup } from "@/types/database";

const PAGE_SIZE = 9;

/**
 * Content-safety note: writeups are technical case studies of defensive
 * analysis, tools and methodology. Nothing here should ever contain real
 * credentials, private target information, or step-by-step attack
 * instructions against systems the author doesn't own/have authorization
 * to test — enforced editorially, not by this query layer.
 */
export async function listPublishedWriteups(page = 0): Promise<{ writeups: SecurityWriteup[]; total: number }> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("security_writeups")
    .select("*", { count: "exact" })
    .eq("content_status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { writeups: data ?? [], total: count ?? 0 };
}

export async function getWriteupBySlug(slug: string): Promise<SecurityWriteup | null> {
  const { data, error } = await supabase
    .from("security_writeups")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}
