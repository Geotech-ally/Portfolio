import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/database";

const PAGE_SIZE = 9;

export async function listPublishedPosts(page = 0): Promise<{ posts: BlogPost[]; total: number }> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("content_status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}
