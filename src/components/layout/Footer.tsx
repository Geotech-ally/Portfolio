import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/layout/Container";
import { useProfile } from "@/hooks/useProfile";

function FacebookIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.1c0-.9.3-1.6 1.7-1.6H17V2.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V9.8H8v3.2h2.6v8h2.9Z" />
    </svg>
  );
}

function InstagramIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2h3.4l-7.4 8.5L22.7 22h-6.7l-5.2-7.5L4.7 22H1.3l7.9-9.1L1.2 2h6.9l4.7 6.9L18.9 2Zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20Z" />
    </svg>
  );
}

const getSocialEntry = (profile: any, label: string) => {
  const direct = profile?.other_links?.find((entry: { label: string; url: string }) => entry.label.toLowerCase() === label.toLowerCase());
  if (direct?.url) return direct.url;
  if (label === "GitHub" && profile?.github_url) return profile.github_url;
  if (label === "LinkedIn" && profile?.linkedin_url) return profile.linkedin_url;
  return null;
};

export function Footer() {
  const { data: profile } = useProfile();
  const year = new Date().getFullYear();

  const socialLinks = [
    { label: "Facebook", href: getSocialEntry(profile, "Facebook"), Icon: FacebookIcon },
    { label: "Instagram", href: getSocialEntry(profile, "Instagram"), Icon: InstagramIcon },
    { label: "Twitter / X", href: getSocialEntry(profile, "Twitter") ?? getSocialEntry(profile, "X") ?? getSocialEntry(profile, "Twitter / X"), Icon: TwitterIcon },
    { label: "LinkedIn", href: getSocialEntry(profile, "LinkedIn"), Icon: LinkedinIcon },
    { label: "GitHub", href: getSocialEntry(profile, "GitHub"), Icon: GithubIcon },
  ].filter((item) => item.href) as Array<{ label: string; href: string; Icon: any }>;

  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-heading-md text-foreground">{profile?.full_name ?? "Geoffrey Akoo"}</p>
          <p className="text-meta mt-2">{profile?.professional_title ?? "Full-Stack Developer + Cybersecurity Analyst"}</p>
          <p className="text-body mt-4 text-sm text-foreground-muted">
            I build secure, practical systems and web applications with a clear focus on reliability, maintainability, and sound engineering decisions.
          </p>
        </div>

        <div>
          <p className="text-meta mb-3 text-foreground">Quick Links</p>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/skills" className="hover:text-foreground">Skills</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-meta mb-3 text-foreground">Contact</p>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li><Link to="/contact" className="hover:text-foreground">Get in touch</Link></li>
            {profile?.email ? (
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-foreground">
                  {profile.email}
                </a>
              </li>
            ) : null}
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-meta mb-3 text-foreground">Social</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                {typeof Icon === "function" && Icon !== Mail ? <Icon width={16} height={16} /> : <ArrowUpRight size={16} />}
              </a>
            ))}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <Mail size={16} />
              </a>
            ) : null}
            {profile?.location ? (
              <a
                href="https://www.openstreetmap.org/search?query=Bondo%2C%20Siaya%20County%2C%20Kenya"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Location"
                className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <MapPin size={16} />
              </a>
            ) : null}
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-start justify-between gap-2 text-xs text-foreground-faint sm:flex-row sm:items-center">
          <p>© {year} {profile?.full_name ?? "Geoffrey Akoo"}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
