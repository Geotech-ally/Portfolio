import { Mail, MapPin, MessageSquareText, ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useProfile } from "@/hooks/useProfile";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";

export default function Contact() {
  usePageMetadata({
    title: "Contact | Geoffrey Akoo",
    description: "Professional contact details for Geoffrey Akoo.",
    path: "/contact",
  });

  const { data: profile } = useProfile();

  const links = [
    profile?.email
      ? {
          label: "Email",
          href: `mailto:${profile.email}`,
          value: profile.email,
          icon: Mail,
        }
      : null,
    {
      label: "WhatsApp",
      href: "https://wa.me/254768998191",
      value: "+254 768 998 191",
      icon: MessageSquareText,
    },
    profile?.github_url
      ? {
          label: "GitHub",
          href: profile.github_url,
          value: profile.github_url.replace(/^https?:\/\//, ""),
          icon: GithubIcon,
        }
      : null,
    profile?.linkedin_url
      ? {
          label: "LinkedIn",
          href: profile.linkedin_url,
          value: profile.linkedin_url.replace(/^https?:\/\//, ""),
          icon: LinkedinIcon,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    value: string;
    icon: typeof Mail;
  }>;

  return (
    <Section>
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact"
        description="If you'd like to discuss a product, project, engineering challenge, or security-focused opportunity, here are the verified ways to reach Geoffrey Akoo."
      />

      <div className="max-w-4xl space-y-6">
        <div className="rounded-2xl border border-border bg-background-raised p-6 md:p-8">
          <p className="text-body text-foreground-muted">
            I’m available for practical engineering work, technical collaboration, and professional conversations around software systems, secure product design, and platform development.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map(({ label, href, value, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              aria-label={label}
              className="group rounded-xl border border-border bg-background-raised p-5 transition-colors hover:border-primary"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
                  <Icon width={18} height={18} />
                </div>
                <ArrowUpRight size={16} className="text-foreground-faint transition-colors group-hover:text-primary" />
              </div>

              <p className="mt-4 text-meta text-foreground-faint">{label}</p>
              <p className="mt-2 break-all text-body text-foreground">{value}</p>
            </a>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background-raised p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-meta text-foreground-faint">Location</p>
              <p className="text-body text-foreground">Bondo, Siaya County, Kenya</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-background p-4">
            <a
              href="https://www.openstreetmap.org/search?query=Bondo%2C%20Siaya%20County%2C%20Kenya"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              Open map in OpenStreetMap <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
