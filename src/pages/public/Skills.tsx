import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listSkillCategories } from "@/services/skills.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const STATIC_SKILL_GROUPS = [
  {
    title: "Frontend Development",
    description: "User-facing product work built with accessible and maintainable interfaces.",
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "React"],
  },
  {
    title: "Backend Development",
    description: "Application logic, service layers and backend workflows that support product functionality.",
    technologies: ["Node.js", "Python", "Flask"],
  },
  {
    title: "Databases",
    description: "Structured data modeling and application data access for reliable product systems.",
    technologies: ["PostgreSQL", "SQLite"],
  },
  {
    title: "APIs & Application Architecture",
    description: "API design, integration and system patterns that connect user flows to backend services.",
    technologies: ["REST API development", "API integration", "Authentication", "Authorization", "Backend service architecture", "Database-driven applications"],
  },
  {
    title: "DevOps / Infrastructure",
    description: "Operational awareness for deployment, environment setup and development workflows.",
    technologies: ["Linux", "Git", "Deployment configuration", "Environment configuration"],
  },
  {
    title: "Cybersecurity",
    description: "Security-aware development rooted in application risk, access control and system review.",
    technologies: ["Cybersecurity analysis", "Network security fundamentals", "OWASP Top 10", "Application security", "Authentication and authorization", "System hardening"],
  },
] as const;

const FALLBACK_SKILL_GROUPS = STATIC_SKILL_GROUPS.map((group) => ({
  title: group.title,
  description: group.description,
  technologies: [...group.technologies],
}));

const getFallbackTechnologies = (title: string): string[] => {
  const group = FALLBACK_SKILL_GROUPS.find((item) => item.title === title);
  return group?.technologies ?? [];
};

const PROJECT_CONTEXT = [
  {
    title: "SaaS Analytics Dashboard",
    summary: "Product-oriented web application work centered on secure data access, analytics workflows and a database-backed architecture.",
    stack: ["React", "TypeScript", "PostgreSQL", "Secure application architecture"],
  },
  {
    title: "Siaya Community Digital Hub",
    summary: "Community platform work that relies on modern web tooling, backend service patterns and data-driven features.",
    stack: ["Modern frontend development", "Backend service patterns", "Database-driven features"],
  },
  {
    title: "Personal Portfolio",
    summary: "Portfolio and CMS implementation built for a modern web stack and secure content delivery patterns.",
    stack: ["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS"],
  },
  {
    title: "Networking Architecture",
    summary: "Systems-oriented work that reinforces the relationship between application development and network-aware security thinking.",
    stack: ["Linux", "Network security fundamentals", "Network architecture"],
  },
];

export default function Skills() {
  usePageMetadata({
    title: "Skills | Geoffrey Akoo",
    description: "Skills and technical capabilities of Geoffrey Akoo across frontend, backend, databases, infrastructure and cybersecurity.",
    path: "/skills",
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["skills"], queryFn: listSkillCategories });

  const skillGroups = data && data.length > 0
    ? [
        {
          title: "Frontend Development",
          description: "User-facing product work built with maintainable interfaces and modern web patterns.",
          technologies: data.find((category) => /frontend/i.test(category.name))?.skills.map((skill) => skill.name) ?? getFallbackTechnologies("Frontend Development"),
        },
        {
          title: "Backend Development",
          description: "Application logic and service layers that support business workflows and product functionality.",
          technologies: data.find((category) => /backend/i.test(category.name))?.skills.map((skill) => skill.name) ?? getFallbackTechnologies("Backend Development"),
        },
        {
          title: "Databases",
          description: "Data modeling and access patterns for reliable, database-backed applications.",
          technologies: data.find((category) => /database/i.test(category.name) || /databases/i.test(category.name))?.skills.map((skill) => skill.name) ?? getFallbackTechnologies("Databases"),
        },
        {
          title: "APIs & Application Architecture",
          description: "System design patterns that connect application flows, APIs and secure data access.",
          technologies: ["REST API development", "API integration", "Authentication", "Authorization", "Backend service architecture", "Database-driven applications"],
        },
        {
          title: "DevOps / Infrastructure",
          description: "Operational awareness for environments, configuration and deployment workflows.",
          technologies: data.find((category) => /tool|platform/i.test(category.name))?.skills.map((skill) => skill.name) ?? getFallbackTechnologies("DevOps / Infrastructure"),
        },
        {
          title: "Cybersecurity",
          description: "Security-aware engineering grounded in application risk and practical system review.",
          technologies: data.find((category) => /cybersecurity/i.test(category.name))?.skills.map((skill) => skill.name) ?? getFallbackTechnologies("Cybersecurity"),
        },
      ]
    : FALLBACK_SKILL_GROUPS;

  return (
    <Section>
      <SectionHeading
        eyebrow="Capabilities"
        title="Technical capability map"
        description="A focused view of the technologies, system patterns and security-aware practices represented in this portfolio."
      />

      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Skill categories will appear here once published."
      >
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title} className="rounded-lg border border-border bg-background-raised p-5">
              <p className="text-meta text-foreground">{group.title}</p>
              <p className="mt-3 text-sm text-foreground-muted">{group.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.technologies.map((technology) => (
                  <li key={`${group.title}-${technology}`} className="text-meta rounded-sm border border-border px-2 py-1 text-foreground">
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Project context"
            title="How these capabilities show up in real work"
            description="The portfolio reflects product development across full-stack web applications, community platforms, analytics products and secure architecture work."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {PROJECT_CONTEXT.map((project) => (
              <div key={project.title} className="rounded-lg border border-border p-5">
                <p className="text-heading-md text-foreground">{project.title}</p>
                <p className="mt-3 text-sm text-foreground-muted">{project.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li key={`${project.title}-${item}`} className="text-meta rounded-sm border border-border px-2 py-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </AsyncSection>
    </Section>
  );
}
