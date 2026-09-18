import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listPublishedPosts } from "@/services/blog.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function Blog() {
  usePageMetadata({
    title: "Blog | Geoffrey Akoo",
    description: "Technical writing on software engineering, cybersecurity and systems thinking by Geoffrey Akoo.",
    path: "/blog",
  });

  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-posts", page],
    queryFn: () => listPublishedPosts(page),
  });

  return (
    <Section>
      <SectionHeading eyebrow="Writing" title="Blog" description="Technical notes on software engineering, security, networking and systems thinking." />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.posts.length === 0}
        emptyTitle="Posts will appear here once published."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="rounded-lg border border-border p-6 transition-colors hover:border-primary">
              <p className="text-meta">
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
                {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ""}
              </p>
              <h3 className="text-heading-md mt-2 text-foreground">{post.title}</h3>
              <p className="text-body mt-2 text-sm text-foreground-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
        {data && data.total > 9 ? (
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
              disabled={(page + 1) * 9 >= data.total}
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
