import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeading } from "@/components/layout/Section";
import { LinkButton } from "@/components/ui/link-button";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { listPublishedProjects } from "@/services/projects.service";
import { listSkillCategories } from "@/services/skills.service";

export default function Home() {
  const { data: profile } = useProfile();
  const { data: featuredProjects } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => listPublishedProjects({ featuredOnly: true }),
  });
  const { data: skillCategories } = useQuery({
    queryKey: ["skills"],
    queryFn: listSkillCategories,
  });

  return (
    <>
      {/* ---- Hero: asymmetric, left-aligned, status-readout panel on the right ---- */}
      <section className="border-b border-border">
        <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="fade-up">
            <p className="text-meta mb-4">Geoffrey Akoo</p>
            <h1 className="text-display text-foreground">
              Full-Stack Developer
              <br />
              · Cybersecurity Analyst
            </h1>
            <p className="text-body mt-6 text-foreground-muted">
              {profile?.short_bio ??
                "I build secure, scalable web applications and cybersecurity-focused digital systems for teams that need dependable software and thoughtful security."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/projects">View Projects</LinkButton>
              <LinkButton to="/contact" variant="secondary">Contact Me</LinkButton>
              <LinkButton to="/resume" variant="ghost">View Resume</LinkButton>
            </div>
            <div className="mt-8 flex items-center gap-4">
              {profile?.github_url ? (
                <a href={profile.github_url} target="_blank" rel="noreferrer noopener" className="text-foreground-muted hover:text-foreground" aria-label="GitHub">
                  <GithubIcon width={20} height={20} />
                </a>
              ) : null}
              {profile?.linkedin_url ? (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer noopener" className="text-foreground-muted hover:text-foreground" aria-label="LinkedIn">
                  <LinkedinIcon width={20} height={20} />
                </a>
              ) : null}
              <Link to="/resume" className="text-sm text-foreground-muted underline decoration-border underline-offset-4 hover:text-foreground">
                Resume
              </Link>
            </div>
          </div>

          {/* Status readout panel — the hero's one deliberate visual device */}
          <div className="rounded-lg border border-border bg-background-raised p-6 font-mono text-sm">
            <p className="mb-4 text-xs text-foreground-faint">STATUS</p>
            <dl className="space-y-3">
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-foreground-muted">location</dt>
                <dd className="text-foreground">{profile?.location ?? "Nakuru, Kenya"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-foreground-muted">availability</dt>
                <dd className={profile?.is_available === false ? "text-foreground" : "text-success"}>
                  {profile?.is_available === false ? "not currently available" : "open for projects"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-foreground-muted">focus</dt>
                <dd className="text-foreground">web + network + security</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground-muted">stack</dt>
                <dd className="text-right text-foreground">React · TypeScript · Supabase</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* ---- Featured projects ---- */}
      <Section divider>
        <SectionHeading
          eyebrow="Selected work"
          title="Featured projects"
          description="Case studies from web development, network engineering and IT consulting."
        />
        {!featuredProjects || featuredProjects.length === 0 ? (
          <p className="text-body text-foreground-muted">
            Featured projects will appear here once published from the admin dashboard.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
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
                  {project.project_technologies.slice(0, 4).map((t) => (
                    <li key={t.technology} className="text-meta rounded-sm border border-border px-2 py-1">
                      {t.technology}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* ---- Skills strip ---- */}
      <Section divider>
        <SectionHeading eyebrow="Technical range" title="Where I work" />
        {!skillCategories || skillCategories.length === 0 ? (
          <p className="text-body text-foreground-muted">Skill categories will populate here from the CMS.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((category) => (
              <div key={category.id}>
                <p className="text-meta mb-3 text-foreground">{category.name}</p>
                <ul className="space-y-1.5 text-sm text-foreground-muted">
                  {category.skills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ---- CTA ---- */}
      <Section divider className="text-center sm:text-left">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-heading-lg text-foreground">Have a project in mind?</h2>
            <p className="text-body mt-2 text-foreground-muted">I read every message and reply within a couple of days.</p>
          </div>
          <LinkButton to="/contact" size="lg">Contact Me</LinkButton>
        </div>
      </Section>
    </>
  );
}
