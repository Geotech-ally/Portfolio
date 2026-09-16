import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/layout/Section";
import { getWriteupBySlug } from "@/services/security.service";
import { Markdown } from "@/components/shared/Markdown";
import { LoadingGrid, ErrorState } from "@/components/shared/AsyncStates";

export default function SecurityWriteupDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: writeup, isLoading, isError } = useQuery({
    queryKey: ["writeup", slug],
    queryFn: () => getWriteupBySlug(slug as string),
    enabled: !!slug,
  });

  return (
    <Section>
      {isLoading ? <LoadingGrid count={1} /> : null}
      {isError ? <ErrorState /> : null}
      {!isLoading && !writeup ? (
        <p className="text-body text-foreground-muted">
          Writeup not found. <Link to="/security-lab" className="text-primary">Back to Security Lab</Link>
        </p>
      ) : null}
      {writeup ? (
        <article className="max-w-3xl">
          <p className="text-meta mb-3">
            {writeup.category}
            {writeup.severity ? ` · ${writeup.severity}` : ""}
          </p>
          <h1 className="text-heading-lg text-foreground">{writeup.title}</h1>
          <p className="text-body mt-3 text-foreground-muted">{writeup.summary}</p>
          {writeup.tools?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {writeup.tools.map((t) => (
                <li key={t} className="text-meta rounded-sm border border-border px-2 py-1">{t}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8">
            <Markdown content={writeup.content_markdown} />
          </div>
        </article>
      ) : null}
    </Section>
  );
}
