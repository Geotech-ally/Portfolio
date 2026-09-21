import { Section, SectionHeading } from "@/components/layout/Section";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useProfile } from "@/hooks/useProfile";

const PHILOSOPHY = [
  {
    title: "Understand",
    body: "I start with the problem, the users and the constraints before deciding how to solve it.",
  },
  {
    title: "Design",
    body: "I shape the architecture around maintainability, clarity and the trade-offs that matter to the application.",
  },
  {
    title: "Build",
    body: "I build practical systems with clear interfaces, reliable data flows and code that is easy to extend.",
  },
  {
    title: "Test",
    body: "I validate behavior early so the solution remains reliable as requirements and conditions evolve.",
  },
  {
    title: "Secure",
    body: "Security is part of product quality and is considered during design, implementation and operation.",
  },
  {
    title: "Improve",
    body: "I review the result, tighten the weak points and refine the solution as I learn more about the system.",
  },
];

export default function About() {
  const { data: profile } = useProfile();

  usePageMetadata({
    title: "About | Geoffrey Akoo",
    description: "Professional profile for Geoffrey Akoo, a full-stack web developer and cybersecurity analyst focused on secure systems, modern web engineering and thoughtful application design.",
    path: "/about",
  });

  const professionalTitle = profile?.professional_title ?? "Full-Stack Developer + Cybersecurity Analyst";
  const introText = profile?.long_bio ?? profile?.short_bio ??
    "I build software systems that connect user-facing experiences with reliable backend logic, secure data handling and practical security thinking.";

  return (
    <>
      <Section>
        <p className="text-meta mb-3">About</p>
        <h1 className="text-heading-lg text-foreground">{profile?.full_name ?? "Geoffrey Akoo"}</h1>
        <p className="text-meta mt-2 text-foreground-muted">{professionalTitle}</p>
        <p className="text-body mt-6 max-w-3xl text-foreground-muted">{introText}</p>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Professional profile" title="Who I am" />
        <div className="max-w-3xl space-y-4 text-body text-foreground-muted">
          <p>
            I am Geoffrey Akoo, a Full-Stack Web Developer + Cybersecurity Analyst. My work sits at the intersection of product development and security-conscious engineering: I build web applications that are usable, maintainable and designed with risk awareness in mind.
          </p>
          <p>
            I enjoy building software that connects interfaces, APIs, data models and system behavior into a single coherent product. My background in full-stack development is paired with a cybersecurity lens, which helps me think carefully about authentication, authorization, validation, secure data access and resilient design.
          </p>
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="What I do" title="Full-stack development and cybersecurity" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-background-raised p-6">
            <p className="text-meta text-foreground">Full-Stack Web Development</p>
            <p className="mt-3 text-body text-foreground-muted">
              I work across the stack to build modern web applications, from frontend experiences and product flows to backend logic, API integrations and database-backed workflows.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background-raised p-6">
            <p className="text-meta text-foreground">Cybersecurity Analysis</p>
            <p className="mt-3 text-body text-foreground-muted">
              I apply a security mindset to the systems I build, thinking about access control, data handling, validation, secure API design and the broader system risks that shape reliable software.
            </p>
          </div>
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Development focus" title="Where I work across the stack" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[
            "Frontend development",
            "Backend development",
            "API engineering",
            "Database design and data access",
            "Application architecture",
            "Deployment and infrastructure awareness",
          ].map((item) => (
            <div key={item} className="border-t border-border-strong pt-4">
              <p className="text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Security mindset" title="How cybersecurity shapes my work" />
        <div className="max-w-3xl space-y-4 text-body text-foreground-muted">
          <p>
            Security is not treated as a separate layer added at the end of a project. It informs how I design software, how I validate input, how I handle data access and how I think about authentication, authorization, least privilege and secure defaults.
          </p>
          <p>
            I pay attention to the practical details that matter in real systems: secure API design, defensive coding practices, application validation, tenant-aware access patterns where relevant, and OWASP-aware development habits. I do not assume that any system is automatically secure; I build with the right controls and continue improving as risks are identified.
          </p>
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Technical approach" title="How I approach technical work" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {PHILOSOPHY.map((item) => (
            <div key={item.title} className="border-t border-border-strong pt-4">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-body mt-2 text-sm text-foreground-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Professional direction" title="Where I’m headed" />
        <div className="max-w-3xl text-body text-foreground-muted">
          <p>
            I am interested in building practical software systems that solve real problems and continuing to develop expertise across both full-stack engineering and cybersecurity. I value work that combines product thinking, secure design and technical craftsmanship, and I am motivated by systems that are useful, maintainable and resilient.
          </p>
        </div>
      </Section>
    </>
  );
}
