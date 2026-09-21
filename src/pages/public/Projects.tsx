import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listPublishedProjects } from "@/services/projects.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const REPO_PROJECTS = [
  {
    id: "saas-analytics",
    title: "SaaS Analytics",
    slug: "saas-analytics-dashboard",
    category: "SaaS / Analytics",
    short_description: "Analytics product case study focused on secure dashboard-driven data workflows and product visibility.",
    problem: "Turning operational and product data into a clear, useful decision-making workflow for teams that need to act quickly.",
    technologies: ["React", "TypeScript", "PostgreSQL", "API integration", "Authentication", "Secure application architecture"],
    capabilities: ["Dashboard experience", "Backend/API integration", "Database-driven reporting", "Security-aware application design"],
    security: "Authentication, access control and secure data handling are central concerns for analytics systems that expose operational data.",
  },
  {
    id: "nexacare-hms",
    title: "Nexacare HMS",
    slug: "nexacare-hms",
    category: "Healthcare / Management System",
    short_description: "Healthcare workflow project centered on application logic, structured data and operational coordination.",
    problem: "Supporting healthcare administration and coordination through a system that organizes workflows, data access and process visibility.",
    technologies: ["React", "TypeScript", "Backend/API development", "Database architecture", "Healthcare workflow support"],
    capabilities: ["Healthcare workflow logic", "API-driven coordination", "Database-backed operations", "Security-focused system design"],
    security: "Healthcare software benefits from disciplined access control, secure API design and careful handling of sensitive operational data.",
  },
  {
    id: "siaya-community",
    title: "Siaya Community Digital Hub Learning Platform",
    slug: "siaya-community-digital-hub",
    category: "Education / Community",
    short_description: "Community platform case study focused on learning access, digital content and platform usability.",
    problem: "Providing a digital platform for community learning and access to information in a practical, structured way.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Modern frontend development", "Backend service architecture"],
    capabilities: ["Community platform UX", "Content-driven workflows", "API and data access patterns", "Scalable product structure"],
    security: "Community platforms require secure access patterns, content protection and careful validation around user-facing workflows.",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    slug: "personal-portfolio",
    category: "Developer Portfolio",
    short_description: "Portfolio and CMS built to present work, engineering capability and project context in a structured way.",
    problem: "Creating a professional digital presence that clearly communicates technical capability, project context and product thinking.",
    technologies: ["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS", "Content management"],
    capabilities: ["Responsive frontend design", "Content-driven architecture", "Security-aware implementation", "Modern product presentation"],
    security: "A portfolio still benefits from careful security defaults, structured content access and a clear separation between public and protected data.",
  },
] as const;

export default function Projects() {
  usePageMetadata({
    title: "Projects | Geoffrey Akoo",
    description: "Case studies and engineering work by Geoffrey Akoo, covering secure applications, healthcare systems, community platforms and portfolio engineering.",
    path: "/projects",
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["projects"], queryFn: () => listPublishedProjects() });

  const fallbackProjects = REPO_PROJECTS.map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    short_description: project.short_description,
    problem: project.problem,
    technologies: project.technologies,
    capabilities: project.capabilities,
    security: project.security,
  }));

  const liveProjects = (data ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: "Published project",
    short_description: project.short_description,
    problem: project.problem ?? "Project details are available in the published case study content for this work.",
    technologies: project.project_technologies.map((technology) => technology.technology),
    capabilities: project.features.length > 0 ? project.features : ["Product implementation", "Full-stack delivery"],
    security: project.full_description ? "Security-aware engineering and careful handling of user-facing workflows are reflected in the project implementation." : "Security-aware implementation is part of the delivery approach for this project.",
  }));

  const projects = (data && data.length > 0 ? liveProjects : fallbackProjects);

  return (
    <Section>
      <SectionHeading
        eyebrow="Case studies"
        title="Projects"
        description="Verified portfolio work across SaaS, healthcare, community platforms and full-stack product development."
      />

      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Projects will appear here once published from the admin dashboard."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => {
            const projectLink = project.slug ? `/projects/${project.slug}` : "/projects";
            const isFallbackProject = !data || data.length === 0;

            return (
              <Link
                key={project.id}
                to={projectLink}
                className="group rounded-lg border border-border bg-background-raised p-6 transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-meta text-foreground-faint">{project.category}</p>
                    <h3 className="mt-2 text-heading-md text-foreground">{project.title}</h3>
                  </div>
                  <ArrowUpRight size={18} className="shrink-0 text-foreground-faint transition-colors group-hover:text-primary" />
                </div>

                <p className="mt-4 text-body text-sm text-foreground-muted">{project.short_description}</p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-meta text-foreground-faint">Problem / domain</p>
                    <p className="mt-2 text-sm text-foreground-muted">{project.problem}</p>
                  </div>
                  <div>
                    <p className="text-meta text-foreground-faint">Security relevance</p>
                    <p className="mt-2 text-sm text-foreground-muted">{project.security}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-meta text-foreground-faint">Main technologies</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li key={`${project.id}-${technology}`} className="text-meta rounded-sm border border-border px-2 py-1">
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <p className="text-meta text-foreground-faint">Capabilities demonstrated</p>
                  <ul className="mt-2 space-y-2 text-sm text-foreground-muted">
                    {project.capabilities.map((capability) => (
                      <li key={`${project.id}-${capability}`} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isFallbackProject ? (
                  <p className="mt-5 text-meta text-foreground-faint">Project detail remains intentionally limited until the original material is verified and published.</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </AsyncSection>
    </Section>
  );
}
