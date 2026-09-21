import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/database";

const PAGE_SIZE = 9;

export interface BlogCategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface BlogTagSummary {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostWithRelations extends BlogPost {
  blog_categories: BlogCategorySummary | null;
  blog_post_tags: { blog_tags: BlogTagSummary | null }[];
}

function normalizePost(post: BlogPostWithRelations) {
  return {
    ...post,
    category: post.blog_categories,
    tags: (post.blog_post_tags ?? [])
      .map((entry) => entry.blog_tags)
      .filter((tag): tag is BlogTagSummary => Boolean(tag)),
  };
}

export async function listPublishedPosts(page = 0, pageSize = PAGE_SIZE): Promise<{ posts: ReturnType<typeof normalizePost>[]; total: number }> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*), blog_post_tags(blog_tags(*))", { count: "exact" })
    .eq("content_status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    posts: ((data ?? []) as BlogPostWithRelations[]).map(normalizePost),
    total: count ?? 0,
  };
}

export async function getPostBySlug(slug: string): Promise<ReturnType<typeof normalizePost> | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*), blog_post_tags(blog_tags(*))")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? normalizePost(data as BlogPostWithRelations) : null;
}
