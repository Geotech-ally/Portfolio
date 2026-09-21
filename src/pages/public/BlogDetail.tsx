import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/layout/Section";
import { getPostBySlug, listPublishedPosts } from "@/services/blog.service";
import { Markdown } from "@/components/shared/Markdown";
import { LoadingGrid, ErrorState } from "@/components/shared/AsyncStates";
import { trackEvent } from "@/services/analytics.service";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";

function buildTableOfContents(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => /^#{1,3}\s+/.test(line))
    .map((line) => {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (!match || !match[1] || !match[2]) return null;
      const level = match[1].length;
      const title = match[2].trim();
      return { level, title };
    })
    .filter((entry): entry is { level: number; title: string } => Boolean(entry));
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug as string),
    enabled: !!slug,
  });

  const { data: allPosts } = useQuery({
    queryKey: ["blog-posts-all"],
    queryFn: () => listPublishedPosts(0, 100),
    enabled: !!slug,
  });

  const tableOfContents = post ? buildTableOfContents(post.content_markdown) : [];
  const orderedPosts = allPosts?.posts ?? [];
  const currentIndex = post ? orderedPosts.findIndex((entry) => entry.slug === post.slug) : -1;
  const previousPost = currentIndex > 0 ? orderedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < orderedPosts.length - 1 ? orderedPosts[currentIndex + 1] : null;
  const relatedPosts = (allPosts?.posts ?? []).filter((entry) => entry.slug !== post?.slug && entry.category?.id === post?.category?.id).slice(0, 3);

  useEffect(() => {
    if (post) trackEvent("blog_view", { slug: post.slug });
  }, [post]);

  usePageMetadata({
    title: post ? `${post.title} | Geoffrey Akoo` : "Blog | Geoffrey Akoo",
    description: post ? post.excerpt : "Technical articles and notes from Geoffrey Akoo.",
    path: post ? `/blog/${post.slug}` : "/blog",
  });

  return (
    <Section>
      {isLoading ? <LoadingGrid count={1} /> : null}
      {isError ? <ErrorState /> : null}
      {!isLoading && !post ? (
        <p className="text-body text-foreground-muted">
          Post not found. <Link to="/blog" className="text-primary">Back to blog</Link>
        </p>
      ) : null}
      {post ? (
        <article className="mx-auto max-w-5xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-meta text-foreground-faint hover:text-primary">
            ← Back to blog
          </Link>

          <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-raised">
            {post.cover_image_path ? (
              <img
                src={getPublicUrl(STORAGE_BUCKETS.blogImages, post.cover_image_path)}
                alt={post.title}
                loading="lazy"
                className="h-72 w-full object-cover"
              />
            ) : null}

            <div className="space-y-4 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 text-meta text-foreground-faint">
                <span>{post.category?.name ?? "Engineering"}</span>
                <span>•</span>
                <span>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Published date unavailable"}
                </span>
                {post.reading_time_minutes ? (
                  <>
                    <span>•</span>
                    <span>{post.reading_time_minutes} min read</span>
                  </>
                ) : null}
              </div>

              <h1 className="text-heading-lg text-foreground">{post.title}</h1>
              <p className="text-body text-foreground-muted">{post.excerpt}</p>

              {post.tags.length ? (
                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag.id} className="text-meta rounded-sm border border-border px-2 py-1">
                      {tag.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </header>

          {tableOfContents.length ? (
            <aside className="mt-8 rounded-xl border border-border bg-background-raised p-5">
              <p className="text-meta text-foreground-faint">Table of contents</p>
              <ul className="mt-3 space-y-2 text-body text-foreground-muted">
                {tableOfContents.map((item, index) => (
                  <li key={`${item.title}-${index}`} style={{ marginLeft: `${(item.level - 1) * 0.75}rem` }}>
                    <a href={`#${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:text-primary">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <div className="mt-8 max-w-3xl text-body">
            <Markdown content={post.content_markdown} />
          </div>

          {(previousPost || nextPost) ? (
            <nav className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <div>
                {previousPost ? (
                  <Link to={`/blog/${previousPost.slug}`} className="inline-flex items-center gap-2 text-primary">
                    ← {previousPost.title}
                  </Link>
                ) : null}
              </div>
              <div>
                {nextPost ? (
                  <Link to={`/blog/${nextPost.slug}`} className="inline-flex items-center gap-2 text-primary">
                    {nextPost.title} →
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}

          {relatedPosts.length ? (
            <section className="mt-12">
              <h2 className="text-heading-md text-foreground">Related posts</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {relatedPosts.map((entry) => (
                  <Link key={entry.id} to={`/blog/${entry.slug}`} className="rounded-lg border border-border bg-background-raised p-4 hover:border-primary">
                    <p className="text-meta text-foreground-faint">{entry.category?.name ?? "Engineering"}</p>
                    <h3 className="mt-2 text-heading-sm text-foreground">{entry.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      ) : null}
    </Section>
  );
}
