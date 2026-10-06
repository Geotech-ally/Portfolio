import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Database, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeading } from "@/components/layout/Section";
import { LinkButton } from "@/components/ui/link-button";
import { useProfile } from "@/hooks/useProfile";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useQuery } from "@tanstack/react-query";
import { listPublishedProjects } from "@/services/projects.service";

const coreCapabilities = [
  {
    title: "Full-Stack Web Development",
    description: "Building complete product experiences from UI flows to backend logic and data handling.",
  },
  {
    title: "Frontend Development",
    description: "Designing responsive, accessible interfaces with a strong focus on usability and maintainability.",
  },
  {
    title: "Backend/API Development",
    description: "Creating reliable APIs and service layers that power applications and support business workflows.",
  },
  {
    title: "Database Engineering",
    description: "Structuring data models and queries that keep systems consistent, scalable and easy to reason about.",
  },
  {
    title: "Application Security",
    description: "Applying secure defaults, validation and defensive practices throughout the development lifecycle.",
  },
  {
    title: "Cybersecurity Analysis",
    description: "Reviewing systems through a security lens to identify risks and improve resilience.",
  },
];

const engineeringApproach = [
  { step: "Understand", description: "Clarify goals, constraints and the real user need before building." },
  { step: "Design", description: "Shape maintainable systems and clear interactions grounded in good architecture." },
  { step: "Build", description: "Develop scalable, practical solutions with a focus on quality and maintainability." },
  { step: "Secure", description: "Apply security principles and validation to reduce risk before deployment." },
  { step: "Improve", description: "Test, refine and iterate so the solution keeps working as it evolves." },
];

export default function Home() {
  usePageMetadata({
    title: "Geoffrey Akoo | Full-Stack Web Developer + Cybersecurity Analyst",
    description: "Geoffrey Akoo builds modern web applications with security-conscious engineering and practical cybersecurity awareness.",
    path: "/",
  });

  const { data: profile } = useProfile();
  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listPublishedProjects(),
  });

  const selectedProjects = [
    "saas-analytics",
    "siaya-community-digital-hub",
    "portfolio",
    "health",
    "smart-voting-system",
  ]
    .map((slug) => allProjects.find((project) => project.slug === slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  const projectPreview = selectedProjects.length > 0 ? selectedProjects : allProjects.slice(0, 4);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-36 -top-36 -z-10 h-[34rem] w-[34rem] rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />
        <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-32">
          <div className="fade-up">
            <p className="text-meta eyebrow-mark mb-6 text-foreground-muted">{profile?.full_name ?? "Geoffrey Akoo"} <span className="ml-1 inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 font-sans text-xs tracking-normal text-secondary"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Developer · Security analyst</span></p>
            <h1 className="text-display max-w-xl text-foreground">
              <span className="block">Building useful</span>
              <span className="block text-primary">software,</span>
              <span className="block text-foreground-muted">with security in mind.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-foreground-muted">
              {profile?.short_bio ??
                "I design and build modern web applications with security considered throughout the development lifecycle."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/projects" size="lg">Explore my work <ArrowUpRight size={17} /></LinkButton>
              <LinkButton to="/contact" variant="secondary" size="lg">Let’s talk</LinkButton>
            </div>
            <p className="text-meta mt-8 flex items-center gap-2 text-foreground-faint"><span className="h-px w-8 bg-border-strong" />Full-stack development <span className="text-primary">/</span> Cybersecurity analysis</p>
          </div>

          <div className="surface-card fade-up p-6 sm:p-8" style={{ animationDelay: "100ms" }}>
            <div className="mb-7 flex items-center justify-between gap-4">
              <p className="text-meta text-foreground">Professional focus</p>
              <span className="font-mono text-xs text-foreground-faint">01 — 03</span>
            </div>
            <ul className="space-y-4 text-sm text-foreground-muted">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"><Code2 size={17} aria-hidden="true" /></span>
                <span>Modern full-stack web applications built with clear product thinking and maintainable architecture.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-background text-foreground"><Database size={17} aria-hidden="true" /></span>
                <span>Database-driven systems and API workflows designed for real-world operational use.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary"><ShieldCheck size={17} aria-hidden="true" /></span>
                <span>Security-conscious engineering that considers risk, validation and resilient design from the start.</span>
              </li>
            </ul>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
              <span className="text-meta text-foreground-faint">Working across the stack</span>
              <Link to="/about" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">About me <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </Container>
      </section>

      <Section divider>
        <SectionHeading
          eyebrow="Portfolio overview"
          title="Work across the full product lifecycle"
          description="The portfolio reflects full-stack web development, backend and API work, data-driven application design, and security-aware engineering for digital products that need to be dependable and maintainable."
        />
      </Section>

      <Section divider>
        <SectionHeading
          eyebrow="Core capabilities"
          title="What I bring to a project"
          description="A focused view of the work represented in this portfolio, without listing every tool or technology in detail."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coreCapabilities.map(({ title, description }) => (
            <div key={title} className="surface-card p-5">
              <p className="text-heading-md text-foreground">{title}</p>
              <p className="mt-3 text-body text-sm text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section divider>
        <SectionHeading
          eyebrow="Selected projects"
          title="Recent work in context"
          description="A small preview of the projects represented in this portfolio, with each card linking to the detailed project view."
        />

        {projectPreview.length === 0 ? (
          <p className="text-body text-foreground-muted">Published projects will appear here once they are added to the portfolio.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {projectPreview.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="surface-card group flex h-full flex-col p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-heading-md text-foreground">{project.title}</h3>
                  <ArrowUpRight size={18} className="shrink-0 text-foreground-faint transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-3 text-sm text-foreground-muted">{project.short_description}</p>

                <div className="mt-4">
                  <p className="text-meta text-foreground-faint">Type</p>
                  <p className="mt-1 text-sm text-foreground">{project.status}</p>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.project_technologies.slice(0, 3).map((technology) => (
                    <li key={`${project.id}-${technology.technology}`} className="text-meta rounded-sm border border-border px-2 py-1">
                      {technology.technology}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <LinkButton to="/projects" variant="secondary">View All Projects</LinkButton>
        </div>
      </Section>

      <Section divider>
        <SectionHeading
          eyebrow="Engineering approach"
          title="How I approach delivery"
          description="The goal is not just to ship features, but to build solutions that are understandable, maintainable and secure."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {engineeringApproach.map(({ step, description }, index) => (
            <div key={step} className="surface-card p-5">
              <p className="text-meta text-foreground-faint">0{index + 1}</p>
              <h3 className="mt-3 text-heading-md text-foreground">{step}</h3>
              <p className="mt-2 text-sm text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section divider>
        <SectionHeading
          eyebrow="Next step"
          title="Explore the portfolio and start a conversation"
          description="Whether you are reviewing the project work, learning more about the approach, or looking to connect, the next step is straightforward."
        />
        <div className="flex flex-wrap gap-3">
          <LinkButton to="/projects">Explore Projects</LinkButton>
          <LinkButton to="/about" variant="secondary">Learn More About Me</LinkButton>
          <LinkButton to="/contact" variant="ghost">Contact Me</LinkButton>
        </div>
      </Section>
    </>
  );
}
