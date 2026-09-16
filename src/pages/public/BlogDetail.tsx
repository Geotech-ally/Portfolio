import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/layout/Section";
import { getPostBySlug } from "@/services/blog.service";
import { Markdown } from "@/components/shared/Markdown";
import { LoadingGrid, ErrorState } from "@/components/shared/AsyncStates";
import { trackEvent } from "@/services/analytics.service";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug as string),
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) trackEvent("blog_view", { slug: post.slug });
  }, [post]);

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
        <article className="max-w-3xl">
          <p className="text-meta mb-3">
            {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
            {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ""}
          </p>
          <h1 className="text-heading-lg text-foreground">{post.title}</h1>
          <p className="text-body mt-3 text-foreground-muted">{post.excerpt}</p>
          <div className="mt-8">
            <Markdown content={post.content_markdown} />
          </div>
        </article>
      ) : null}
    </Section>
  );
}
