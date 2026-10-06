import { supabase } from "@/lib/supabase";
import type { BlogCategory, BlogPost, BlogTag } from "@/types/database";

const PAGE_SIZE = 9;

export type BlogCategorySummary = Pick<BlogCategory, "id" | "name" | "slug">;
export type BlogTagSummary = Pick<BlogTag, "id" | "name" | "slug">;

export type BlogPostWithRelations = BlogPost & {
  category: BlogCategorySummary | null;
  tags: BlogTagSummary[];
};

async function runBlogQuery<T extends { error: unknown }>(
  operation: string,
  execute: () => PromiseLike<T>
): Promise<Omit<T, "error"> & { error: null }> {
  try {
    const result = await execute();
    if (result.error) throw result.error;
    return result as Omit<T, "error"> & { error: null };
  } catch (error) {
    if (import.meta.env.DEV) {
      const details = error && typeof error === "object"
        ? error as { code?: unknown; message?: unknown; details?: unknown; hint?: unknown }
        : { message: String(error) };

      console.error(`[Blog] Supabase query failed: ${operation}`, {
        code: details.code,
        message: details.message,
        details: details.details,
        hint: details.hint,
      });
    }
    throw error;
  }
}

async function attachRelations(posts: BlogPost[]): Promise<BlogPostWithRelations[]> {
  if (posts.length === 0) return [];

  const postIds = posts.map((post) => post.id);
  const categoryIds = [...new Set(posts.flatMap((post) => post.category_id ? [post.category_id] : []))];

  const categoriesById = new Map<string, BlogCategorySummary>();
  if (categoryIds.length > 0) {
    const { data } = await runBlogQuery("load categories for published posts", () => supabase
      .from("blog_categories")
      .select("id, name, slug")
      .in("id", categoryIds));
    for (const category of data ?? []) categoriesById.set(category.id, category);
  }

  const { data: postTags } = await runBlogQuery("load tag links for published posts", () => supabase
    .from("blog_post_tags")
    .select("post_id, tag_id")
    .in("post_id", postIds));

  const tagIds = [...new Set((postTags ?? []).map((entry) => entry.tag_id))];
  const tagsById = new Map<string, BlogTagSummary>();
  if (tagIds.length > 0) {
    const { data } = await runBlogQuery("load tags for published posts", () => supabase
      .from("blog_tags")
      .select("id, name, slug")
      .in("id", tagIds));
    for (const tag of data ?? []) tagsById.set(tag.id, tag);
  }

  const tagsByPostId = new Map<string, BlogTagSummary[]>();
  for (const entry of postTags ?? []) {
    const tag = tagsById.get(entry.tag_id);
    if (!tag) continue;
    const tags = tagsByPostId.get(entry.post_id) ?? [];
    tags.push(tag);
    tagsByPostId.set(entry.post_id, tags);
  }

  return posts.map((post) => ({
    ...post,
    category: post.category_id ? categoriesById.get(post.category_id) ?? null : null,
    tags: tagsByPostId.get(post.id) ?? [],
  }));
}

/** Public listing: published posts only; RLS independently enforces visibility. */
export async function listPublishedPosts(
  page = 0,
  pageSize = PAGE_SIZE
): Promise<{ posts: BlogPostWithRelations[]; total: number }> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await runBlogQuery("list published posts", () => supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("content_status", "published")
    .order("published_at", { ascending: false })
    .range(from, to));

  const posts = await attachRelations((data ?? []) as BlogPost[]);
  return { posts, total: count ?? 0 };
}

/** Public detail lookup: unpublished and missing posts are indistinguishable. */
export async function getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  const { data } = await runBlogQuery("load published post by slug", () => supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle());
  if (!data) return null;

  const [post] = await attachRelations([data as BlogPost]);
  return post ?? null;
}
