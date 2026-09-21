import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { Section } from "@/components/layout/Section";
import { getProjectBySlug } from "@/services/projects.service";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { LoadingGrid, ErrorState } from "@/components/shared/AsyncStates";
import { trackEvent } from "@/services/analytics.service";
import { useEffect } from "react";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const projectProfiles: Record<string, { category: string; architecture: string; security: string; role: string; outcome: string; lessons: string; challenge: string; }> = {
  "saas-analytics-dashboard": {
    category: "SaaS / Analytics",
    architecture: "Frontend → application API / business logic → PostgreSQL data layer → authentication, RBAC and supporting service integrations.",
    security: "Authentication, authorization, role-based access controls, dataset isolation and secure access to application data are core system concerns for this type of product.",
    role: "This project reflects full-stack product work spanning user experience, backend/API interaction, data handling and security-aware implementation.",
    outcome: "This is presented as a portfolio case study for a SaaS-style analytics product and reflects the implementation patterns used for dashboard-heavy systems.",
    lessons: "This work demonstrates product thinking, secure application architecture, dashboard UX and data-driven full-stack delivery.",
    challenge: "The central product challenge is making operational data usable without losing clarity, structure or security controls across dashboard-driven workflows.",
  },
  "siaya-community-digital-hub": {
    category: "Community / Learning Platform",
    architecture: "Frontend application → API/backend services → PostgreSQL data layer → content and user workflows supporting community learning.",
    security: "User-facing platform workflows require secure access control, well-validated content access patterns and careful handling of platform data.",
    role: "This project reflects full-stack delivery for a community-oriented platform, including interface design, data models and backend system coordination.",
    outcome: "This case study represents a learning and community platform concept in the portfolio, with architecture and implementation detail presented at a high level.",
    lessons: "The project demonstrates community platform design, content-driven workflows and full-stack implementation in a product context.",
    challenge: "The main challenge is balancing accessible user experience with structured content, platform workflows and maintainable data access patterns.",
  },
  "personal-portfolio": {
    category: "Developer Portfolio",
    architecture: "React frontend → Vite build pipeline → Supabase-backed content/data layer → public presentation and routing layers.",
    security: "The portfolio uses security-aware defaults, public content separation and controlled access patterns for content and application infrastructure.",
    role: "This project reflects end-to-end implementation across frontend architecture, content/data modeling, responsive design and deployment-oriented engineering.",
    outcome: "This portfolio is an active engineering project that presents work, technical capability and project context in a structured form.",
    lessons: "The portfolio demonstrates modern frontend architecture, content-driven design, responsive implementation and secure public-facing application patterns.",
    challenge: "The challenge here is building a clear, maintainable public-facing system that communicates technical work without overloading the visitor or creating brittle content.",
  },
};

function groupTechnologies(technologies: string[]) {
  const groups = {
    Frontend: [] as string[],
    Backend: [] as string[],
    Database: [] as string[],
    Infrastructure: [] as string[],
    Security: [] as string[],
  };

  const lower = technologies.map((item) => item.toLowerCase());

  for (const technology of technologies) {
    const value = technology.toLowerCase();

    if (["react", "next.js", "vite", "tailwind css", "typescript", "javascript", "html", "css"].some((item) => value.includes(item))) {
      groups.Frontend.push(technology);
    } else if (["node.js", "nestjs", "express", "api", "backend", "serverless", "graphql"].some((item) => value.includes(item))) {
      groups.Backend.push(technology);
    } else if (["postgresql", "postgres", "supabase", "mysql", "mongodb"].some((item) => value.includes(item))) {
      groups.Database.push(technology);
    } else if (["vercel", "supabase", "docker", "aws", "azure", "cloudflare", "deployment", "ci/cd"].some((item) => value.includes(item))) {
      groups.Infrastructure.push(technology);
    } else if (["auth", "authorization", "rbac", "jwt", "oauth", "role-based access", "tenant isolation", "validation", "security"].some((item) => value.includes(item))) {
      groups.Security.push(technology);
    } else if (lower.includes("supabase")) {
      groups.Infrastructure.push(technology);
    } else {
      groups.Backend.push(technology);
    }
  }

  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug as string),
    enabled: !!slug,
  });

  const profile = slug ? projectProfiles[slug] : undefined;
  const techGroups = project ? groupTechnologies(project.project_technologies.map((item) => item.technology)) : [];
  const relatedProjects = [
    { slug: "saas-analytics-dashboard", title: "SaaS Analytics" },
    { slug: "siaya-community-digital-hub", title: "Siaya Community Digital Hub" },
    { slug: "personal-portfolio", title: "Portfolio" },
  ].filter((entry) => entry.slug !== slug);

  useEffect(() => {
    if (project) trackEvent("project_view", { slug: project.slug });
  }, [project]);

  usePageMetadata({
    title: project ? `${project.title} | Geoffrey Akoo` : "Project | Geoffrey Akoo",
    description: project ? project.short_description : "Project detail page for Geoffrey Akoo's engineering work.",
    path: project ? `/projects/${project.slug}` : "/projects",
  });

  if (!slug) return <Navigate to="/projects" replace />;

  return (
    <Section>
      {isLoading ? <LoadingGrid count={1} /> : null}
      {isError ? <ErrorState /> : null}
      {!isLoading && !project ? (
        <div className="space-y-4 text-body text-foreground-muted">
          <p>Project not found.</p>
          <Link to="/projects" className="inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>
      ) : null}

      {project ? (
        <article className="mx-auto max-w-5xl">
          <Link to="/projects" className="inline-flex items-center gap-2 text-meta text-foreground-faint hover:text-primary">
            <ArrowLeft size={14} /> All projects
          </Link>

          <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-raised">
            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
              <div>
                <p className="text-meta text-foreground-faint">{profile?.category ?? "Project"}</p>
                <h1 className="mt-3 text-heading-lg text-foreground">{project.title}</h1>
                <p className="mt-4 max-w-2xl text-body text-foreground-muted">{project.short_description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.project_technologies.map((item) => (
                    <span key={item.technology} className="text-meta rounded-sm border border-border px-2 py-1">
                      {item.technology}
                    </span>
                  ))}
                </div>

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
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
                <div>
                  <p className="text-meta text-foreground-faint">Status</p>
                  <p className="mt-1 text-body text-foreground">{project.status}</p>
                </div>
                <div>
                  <p className="text-meta text-foreground-faint">Role</p>
                  <p className="mt-1 text-body text-foreground">{project.role ?? profile?.role ?? "Role details are pending publication."}</p>
                </div>
                <div>
                  <p className="text-meta text-foreground-faint">Current state</p>
                  <p className="mt-1 text-body text-foreground">{profile?.outcome ?? "The verified project state is currently being documented."}</p>
                </div>
              </div>
            </div>

            {project.cover_image_path ? (
              <div className="border-t border-border bg-background">
                <img
                  src={getPublicUrl(STORAGE_BUCKETS.projectImages, project.cover_image_path)}
                  alt={`${project.title} cover`}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
            ) : null}
          </header>

          <div className="mt-10 space-y-8">
            {project.problem ? (
              <section>
                <h2 className="text-heading-md text-foreground">1. Problem / context</h2>
                <p className="mt-3 text-body text-foreground-muted">{project.problem}</p>
              </section>
            ) : null}

            {project.solution ? (
              <section>
                <h2 className="text-heading-md text-foreground">2. Solution</h2>
                <p className="mt-3 text-body text-foreground-muted">{project.solution}</p>
              </section>
            ) : null}

            {project.features?.length ? (
              <section>
                <h2 className="text-heading-md text-foreground">3. Key features</h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-body text-foreground-muted">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.full_description ? (
              <section>
                <h2 className="text-heading-md text-foreground">4. Project overview</h2>
                <p className="mt-3 text-body text-foreground-muted">{project.full_description}</p>
              </section>
            ) : null}

            {techGroups.length ? (
              <section>
                <h2 className="text-heading-md text-foreground">5. Technology stack</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {techGroups.map(([group, items]) => (
                    <div key={group} className="rounded-xl border border-border bg-background-raised p-4">
                      <p className="text-meta text-foreground-faint">{group}</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {items.map((item) => (
                          <li key={item} className="text-meta rounded-sm border border-border px-2 py-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="text-heading-md text-foreground">6. Architecture</h2>
              <div className="mt-4 rounded-xl border border-border bg-background-raised p-5">
                <div className="flex flex-col gap-3 text-body text-foreground-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <span className="rounded-md border border-border px-3 py-2">Frontend</span>
                  <span aria-hidden="true">↓</span>
                  <span className="rounded-md border border-border px-3 py-2">API / backend</span>
                  <span aria-hidden="true">↓</span>
                  <span className="rounded-md border border-border px-3 py-2">Database</span>
                  <span aria-hidden="true">↓</span>
                  <span className="rounded-md border border-border px-3 py-2">Supporting services</span>
                </div>
                <p className="mt-4 text-body text-foreground-muted">{profile?.architecture ?? "Architecture details for this project are still being verified and published."}</p>
              </div>
            </section>

            <section>
              <h2 className="text-heading-md text-foreground">7. Security considerations</h2>
              <p className="mt-3 text-body text-foreground-muted">{profile?.security ?? "Security controls and implementation details for this project are still being documented."}</p>
            </section>

            <section>
              <h2 className="text-heading-md text-foreground">8. Challenges & engineering decisions</h2>
              <div className="mt-3 rounded-xl border border-border bg-background-raised p-5">
                <p className="text-body text-foreground-muted">{profile?.challenge ?? "Specific challenge and decision history for this project has not been fully documented yet. This section will be expanded as verified project detail becomes available."}</p>
              </div>
            </section>

            <section>
              <h2 className="text-heading-md text-foreground">9. My role</h2>
              <p className="mt-3 text-body text-foreground-muted">{project.role ?? profile?.role ?? "Role details are not yet published for this project."}</p>
            </section>

            <section>
              <h2 className="text-heading-md text-foreground">10. Outcome / current state</h2>
              <p className="mt-3 text-body text-foreground-muted">{profile?.outcome ?? `This project is marked as ${project.status}.`}</p>
            </section>

            <section>
              <h2 className="text-heading-md text-foreground">11. Lessons / engineering takeaways</h2>
              <p className="mt-3 text-body text-foreground-muted">{profile?.lessons ?? "This project demonstrates the practical application of product thinking, iterative engineering and secure implementation patterns."}</p>
            </section>

            {relatedProjects.length ? (
              <section>
                <h2 className="text-heading-md text-foreground">12. Related projects</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {relatedProjects.map((entry) => (
                    <Link key={entry.slug} to={`/projects/${entry.slug}`} className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary">
                      {entry.title}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>
      ) : null}
    </Section>
  );
}
