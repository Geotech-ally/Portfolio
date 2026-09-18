import { Section, SectionHeading } from "@/components/layout/Section";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const PHILOSOPHY = [
  {
    title: "Understand",
    body: "I start from the problem, the users and the constraints before deciding how to solve it.",
  },
  {
    title: "Design",
    body: "Good architecture reduces complexity and makes the system easier to extend and secure.",
  },
  {
    title: "Build",
    body: "I build practical systems with clean interfaces, reliable data flows and maintainable code.",
  },
  {
    title: "Secure",
    body: "Security is part of product quality, not a final step after deployment.",
  },
  {
    title: "Test",
    body: "I validate behavior early and keep quality checks aligned with the real system risks.",
  },
  {
    title: "Deploy",
    body: "Deployment is a product decision as much as a technical one; operations and maintainability matter.",
  },
];

const DETAILS = [
  { label: "Professional identity", value: "Full-Stack Developer + Cybersecurity Analyst" },
  { label: "Education", value: "BSc Information Communication Technology" },
  { label: "Location", value: "Nakuru, Kenya" },
  { label: "Languages", value: "English, Swahili" },
  { label: "Availability", value: "Open for projects" },
];

export default function About() {
  usePageMetadata({
    title: "About | Geoffrey Akoo",
    description: "Professional profile for Geoffrey Akoo, a full-stack developer and cybersecurity analyst focused on secure systems, modern web engineering and practical security.",
    path: "/about",
  });

  return (
    <>
      <Section>
        <p className="text-meta mb-3">About</p>
        <h1 className="text-heading-lg text-foreground">Geoffrey Akoo</h1>
        <p className="text-body mt-4 max-w-2xl text-foreground-muted">
          I am a full-stack developer and cybersecurity analyst focused on building secure, dependable digital systems. My work spans frontend engineering, backend services, database-driven applications, Linux environments and security-conscious application design.
        </p>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Professional profile" title="What I do" />
        <div className="max-w-2xl space-y-4 text-body text-foreground-muted">
          <p>
            I build modern web applications using React, TypeScript and related tooling, and I work across the stack to connect interfaces, APIs, data models and infrastructure with practical product goals.
          </p>
          <p>
            My cybersecurity perspective shapes how I design systems: authentication, authorization, validation, secure storage, least privilege and careful operational defaults matter as much as the application itself.
          </p>
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Engineering philosophy" title="How I work" />
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
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="Background" title="Professional details" className="mb-6" />
            <dl className="space-y-3 text-sm">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex justify-between border-b border-border pb-2 gap-4">
                  <dt className="text-foreground-muted">{d.label}</dt>
                  <dd className="text-right text-foreground">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHeading eyebrow="Experience" title="Technical focus" className="mb-6" />
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-foreground">Frontend engineering</p>
                <p className="text-foreground-muted">User interfaces, product flows, responsive interfaces and design systems for web products.</p>
              </li>
              <li>
                <p className="text-foreground">Backend engineering</p>
                <p className="text-foreground-muted">API design, business logic, database integration and secure access patterns.</p>
              </li>
              <li>
                <p className="text-foreground">Systems and security</p>
                <p className="text-foreground-muted">Linux workflows, networking concepts, secure operations and risk-aware development practices.</p>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
