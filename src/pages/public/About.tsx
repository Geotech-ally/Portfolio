import { Section, SectionHeading } from "@/components/layout/Section";

/**
 * Content migrated from the existing repository's about.html (see
 * docs/MIGRATION.md). This will move into the `profiles` table and be
 * editable from the admin dashboard — it's inlined here for now since
 * there's no live Supabase project yet to seed.
 */
const PHILOSOPHY = [
  {
    title: "Innovation through simplicity",
    body: "The most elegant solutions are often the simplest ones that solve complex problems effectively.",
  },
  {
    title: "Security-first approach",
    body: "Building secure foundations from the start ensures long-term reliability and trust.",
  },
  {
    title: "Client-centric solutions",
    body: "Understanding business objectives drives the creation of truly valuable technical solutions.",
  },
];

const DETAILS = [
  { label: "Education", value: "BSc Information Communication Technology" },
  { label: "Location", value: "Lodwar / Nakuru, Kenya" },
  { label: "Experience", value: "3+ years" },
  { label: "Languages", value: "English, Swahili" },
  { label: "Availability", value: "Open for projects" },
];

export default function About() {
  return (
    <>
      <Section>
        <p className="text-meta mb-3">About</p>
        <h1 className="text-heading-lg text-foreground">Professional IT Specialist &amp; Developer</h1>
        <p className="text-body mt-4 max-w-2xl text-foreground-muted">
          With over three years of experience in the technology industry, I specialize in creating
          comprehensive digital solutions that bridge the gap between business needs and technical
          implementation. My expertise spans web development, network engineering and IT consulting.
        </p>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Background" title="My journey" />
        <div className="max-w-2xl space-y-4 text-body text-foreground-muted">
          <p>
            My journey in technology began during my university years studying Information
            Communication Technology. What started as academic curiosity quickly evolved into a
            passion for solving real-world problems through technology.
          </p>
          <p>
            I&rsquo;ve worked with businesses of all sizes, from startups to established enterprises,
            helping them leverage technology to achieve their goals. Today I continue learning and
            adapting in this rapidly evolving field — currently focused on cloud infrastructure
            automation, AI-assisted development tooling, and IT strategy frameworks for small and
            medium enterprises.
          </p>
        </div>
      </Section>

      <Section divider>
        <SectionHeading eyebrow="Approach" title="Philosophy" />
        <div className="grid gap-6 sm:grid-cols-3">
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
            <SectionHeading eyebrow="Details" title="Professional details" className="mb-6" />
            <dl className="space-y-3 text-sm">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex justify-between border-b border-border pb-2">
                  <dt className="text-foreground-muted">{d.label}</dt>
                  <dd className="text-foreground">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHeading eyebrow="Credentials" title="Education & certifications" className="mb-6" />
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-foreground">BSc Information Communication Technology</p>
                <p className="text-foreground-muted">Comprehensive foundation in computing, networking and information systems.</p>
              </li>
              <li>
                <p className="text-foreground">Intro to Cybersecurity — certificate earned</p>
                <p className="text-foreground-muted">Foundational cybersecurity concepts: threats, defenses and best practices.</p>
              </li>
              <li>
                <p className="text-foreground">Intro to IoT — certificate earned</p>
                <p className="text-foreground-muted">Basics of Internet of Things: sensors, connectivity and edge computing.</p>
              </li>
              <li>
                <p className="text-foreground">Python Programming — certificate earned</p>
                <p className="text-foreground-muted">Fundamentals of Python: scripting, data structures and basic automation.</p>
              </li>
            </ul>
            <p className="text-meta mt-6">
              TODO: replace with verified, up-to-date certifications from the admin dashboard once issuer/date/credential-URL details are confirmed.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
