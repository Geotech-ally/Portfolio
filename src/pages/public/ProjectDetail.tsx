import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { Section } from "@/components/layout/Section";
import { getProjectBySlug } from "@/services/projects.service";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { LoadingGrid, ErrorState } from "@/components/shared/AsyncStates";
import { trackEvent } from "@/services/analytics.service";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug as string),
    enabled: !!slug,
  });

  useEffect(() => {
    if (project) trackEvent("project_view", { slug: project.slug });
  }, [project]);

  if (!slug) return <Navigate to="/projects" replace />;

  return (
    <Section>
      {isLoading ? <LoadingGrid count={1} /> : null}
      {isError ? <ErrorState /> : null}
      {!isLoading && !project ? (
        <div className="text-body text-foreground-muted">
          Project not found. <Link to="/projects" className="text-primary">Back to projects</Link>
        </div>
      ) : null}

      {project ? (
        <article className="max-w-3xl">
          <p className="text-meta mb-3">{project.role ?? "Project"}</p>
          <h1 className="text-heading-lg text-foreground">{project.title}</h1>
          <p className="text-body mt-4 text-foreground-muted">{project.short_description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackEvent("github_click", { slug: project.slug })}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2 text-sm hover:border-primary"
              >
                <GithubIcon width={16} height={16} /> Source
              </a>
            ) : null}
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackEvent("external_link_click", { slug: project.slug, type: "live_demo" })}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2 text-sm hover:border-primary"
              >
                <ExternalLink size={16} /> Live demo
              </a>
            ) : null}
          </div>

          {project.cover_image_path ? (
            <img
              src={getPublicUrl(STORAGE_BUCKETS.projectImages, project.cover_image_path)}
              alt={`${project.title} cover`}
              loading="lazy"
              className="mt-8 w-full rounded-lg border border-border"
            />
          ) : null}

          <div className="mt-10 space-y-8">
            {project.problem ? (
              <div>
                <h2 className="text-heading-md text-foreground">Problem</h2>
                <p className="text-body mt-2 text-foreground-muted">{project.problem}</p>
              </div>
            ) : null}
            {project.solution ? (
              <div>
                <h2 className="text-heading-md text-foreground">Solution</h2>
                <p className="text-body mt-2 text-foreground-muted">{project.solution}</p>
              </div>
            ) : null}
            {project.features?.length ? (
              <div>
                <h2 className="text-heading-md text-foreground">Features</h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-body text-foreground-muted">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.full_description ? (
              <div>
                <h2 className="text-heading-md text-foreground">Overview</h2>
                <p className="text-body mt-2 text-foreground-muted">{project.full_description}</p>
              </div>
            ) : null}
            <div>
              <h2 className="text-heading-md text-foreground">Technology stack</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.project_technologies.map((t) => (
                  <li key={t.technology} className="text-meta rounded-sm border border-border px-2 py-1">
                    {t.technology}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ) : null}
    </Section>
  );
}
