import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listPublishedProjects } from "@/services/projects.service";
import { AsyncSection } from "@/components/shared/AsyncStates";

export default function Projects() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["projects"], queryFn: () => listPublishedProjects() });

  return (
    <Section>
      <SectionHeading
        eyebrow="Case studies"
        title="Projects"
        description="Web development, network engineering and IT consulting work. Each entry links to a full technical write-up."
      />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Projects will appear here once published from the admin dashboard."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group rounded-lg border border-border p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-heading-md text-foreground">{project.title}</h3>
                <ArrowUpRight size={18} className="shrink-0 text-foreground-faint transition-colors group-hover:text-primary" />
              </div>
              <p className="text-body mt-2 text-sm text-foreground-muted">{project.short_description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.project_technologies.slice(0, 5).map((t) => (
                  <li key={t.technology} className="text-meta rounded-sm border border-border px-2 py-1">
                    {t.technology}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </AsyncSection>
    </Section>
  );
}
