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
  "saas-analytics": {
    category: "SaaS / Analytics",
    architecture: "React frontend → Django REST Framework and FastAPI service layer → PostgreSQL data storage with organization-scoped access and analytics processing.",
    security: "Authentication, JWT validation, RBAC, tenant isolation, and organization-aware data access are core concerns in this analytics platform design.",
    role: "The project reflects full-stack product work spanning user experience, API architecture, analytics logic, and security-conscious implementation.",
    outcome: "This case study represents a multi-tenant SaaS analytics platform focused on reporting, operations, and business visibility.",
    lessons: "This work demonstrates secure application design, role-aware access patterns, and analytics-focused product engineering.",
    challenge: "The main challenge is making operational data actionable while preserving clarity, access boundaries, and system trust.",
  },
  "siaya-community-digital-hub": {
    category: "Community / Learning Platform",
    architecture: "Next.js frontend → NestJS backend → Prisma data layer → user and learning workflows for course access and platform operations.",
    security: "The platform needs secure authentication, validated user flows, and careful handling of educational data and access controls.",
    role: "This project reflects full-stack delivery for a community learning product, including interface design, backend service logic, and data modeling.",
    outcome: "This case study represents a learning platform designed to support community education and structured digital access.",
    lessons: "The project demonstrates community platform design, content workflows, and full-stack implementation in a product context.",
    challenge: "Balancing accessible user experience with structured learning workflows and maintainable platform data access is the core challenge.",
  },
  "portfolio": {
    category: "Developer Portfolio",
    architecture: "React frontend → Vite build pipeline → Supabase-backed content/data layer → public presentation and route-based navigation.",
    security: "The portfolio uses controlled public reads, service-layer data access, and security-aware content architecture while preserving a clear separation between public and protected systems.",
    role: "This project reflects end-to-end implementation across frontend architecture, responsive design, content modeling, and deployment-oriented engineering.",
    outcome: "This portfolio is a working engineering project that presents work, technical capability, and project context in a structured way.",
    lessons: "The portfolio demonstrates modern frontend architecture, content-driven design, responsive implementation, and secure public-facing application patterns.",
    challenge: "The challenge is communicating technical work clearly without creating brittle content or overloading the user experience.",
  },
  "health": {
    category: "Healthcare / Management System",
    architecture: "React frontend → Django REST Framework domain APIs → structured healthcare data layer covering users, patients, doctors, appointments, finance, pharmacy, and labs.",
    security: "Healthcare workflows benefit from disciplined access control, secure API design, and careful handling of sensitive operational data.",
    role: "The project reflects healthcare system architecture and workflow-oriented application design across multiple domain areas.",
    outcome: "This case study represents a healthcare management system organized around structured operational workflows and modular domain apps.",
    lessons: "The project highlights the need for clear separation of domain responsibilities, secure data handling, and maintainable app structure.",
    challenge: "The main challenge is managing operational complexity across patient, clinician, scheduling, and administrative workflows without losing clarity.",
  },
  "smart-voting-system": {
    category: "Blockchain / Election System",
    architecture: "React + Vite frontend → Solidity smart contracts → Hardhat deployment and testing environment → Ethereum-compatible voting logic.",
    security: "Wallet-based authentication, smart-contract design, and transparent voting logic are core to the security model of a decentralized election system.",
    role: "The project reflects blockchain-aware interface implementation and a decentralized voting workflow powered by smart contracts.",
    outcome: "This case study represents a voting platform that combines wallet authentication with blockchain-backed election logic.",
    lessons: "The project demonstrates the importance of contract security, transparent election flow design, and secure frontend integration around wallet-based interaction.",
    challenge: "The central challenge is balancing a transparent, trust-oriented voting experience with secure smart-contract behavior and reliable user flow design.",
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
    { slug: "saas-analytics", title: "DataLens — SaaS Analytics Platform" },
    { slug: "siaya-community-digital-hub", title: "Siaya Community Digital Hub Learning Platform" },
    { slug: "portfolio", title: "Portfolio" },
    { slug: "health", title: "Health" },
    { slug: "smart-voting-system", title: "Smart Voting System" },
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
