import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listPublishedPosts } from "@/services/blog.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";

const PAGE_SIZE = 9;

export default function Blog() {
  usePageMetadata({
    title: "Blog | Geoffrey Akoo",
    description: "Technical writing on software engineering, cybersecurity, networking, Linux and systems thinking by Geoffrey Akoo.",
    path: "/blog",
  });

  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-posts", page],
    queryFn: () => listPublishedPosts(page, PAGE_SIZE),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Writing"
        title="Blog"
        description="Articles, tutorials and notes on web development, backend systems, databases, cybersecurity, networking, Linux and engineering practice."
      />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.posts.length === 0}
        emptyTitle="Published posts will appear here as they are added."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-background-raised transition-colors hover:border-primary"
            >
              {post.cover_image_path ? (
                <img
                  src={getPublicUrl(STORAGE_BUCKETS.blogImages, post.cover_image_path)}
                  alt={post.title}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              ) : null}

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3 text-meta text-foreground-faint">
                  <span>{post.category?.name ?? "Engineering"}</span>
                  {post.featured ? <span className="text-primary">Featured</span> : null}
                </div>

                <div>
                  <p className="text-meta text-foreground-faint">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Published date unavailable"}
                    {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ""}
                  </p>
                  <h3 className="mt-2 text-heading-md text-foreground">{post.title}</h3>
                </div>

                <p className="text-body text-sm text-foreground-muted">{post.excerpt}</p>

                {post.tags.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <li key={tag.id} className="text-meta rounded-sm border border-border px-2 py-1">
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        {data && data.total > PAGE_SIZE ? (
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md border border-border-strong px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={(page + 1) * PAGE_SIZE >= data.total}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-border-strong px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </AsyncSection>
    </Section>
  );
}
