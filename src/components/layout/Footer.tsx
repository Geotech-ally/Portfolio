import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { SOCIAL_PROFILES } from "@/components/shared/SocialProfiles";
import { SocialLink } from "@/components/shared/SocialLinks";
import { Container } from "@/components/layout/Container";
import { useProfile } from "@/hooks/useProfile";

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
    ...SOCIAL_PROFILES.map((link) => ({
      ...link,
      href: link.href || getSocialEntry(profile, link.label),
    })),
  ].filter((item) => item.href);

  return (
    <footer className="site-footer theme-surface-transition border-t border-border-strong">
      <Container className="grid gap-x-10 gap-y-9 py-12 sm:grid-cols-2 md:grid-cols-4 md:py-14">
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
          <p className="text-meta mb-3 text-foreground">Connect</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} link={link} />
            ))}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <Mail size={18} />
              </a>
            ) : null}
            {profile?.location ? (
              <a
                href="https://www.openstreetmap.org/search?query=Bondo%2C%20Siaya%20County%2C%20Kenya"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Location"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <MapPin size={18} />
              </a>
            ) : null}
          </div>
        </div>
      </Container>

      <div className="footer-bottom border-t border-border py-6">
        <Container className="flex flex-col items-start justify-between gap-2 text-xs text-foreground-faint sm:flex-row sm:items-center">
          <p>© {year} {profile?.full_name ?? "Geoffrey Akoo"}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
