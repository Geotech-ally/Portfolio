import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/layout/Container";
import { useProfile } from "@/hooks/useProfile";

export function Footer() {
  const { data: profile } = useProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-heading-md text-foreground">{profile?.full_name ?? "Geoffrey Akoo"}</p>
          <p className="text-meta mt-2">{profile?.professional_title ?? "Full-Stack Developer & Cybersecurity Analyst"}</p>
          <p className="text-body mt-4 text-sm text-foreground-muted">
            Building reliable software and thinking about how it fails, from the first line of code.
          </p>
        </div>

        <div>
          <p className="text-meta mb-3 text-foreground">Navigate</p>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/security-lab" className="hover:text-foreground">Security Lab</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/resume" className="hover:text-foreground">Resume</Link></li>
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
          <p className="text-meta mb-3 text-foreground">Elsewhere</p>
          <div className="flex gap-3">
            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <GithubIcon width={16} height={16} />
              </a>
            ) : null}
            {profile?.linkedin_url ? (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <LinkedinIcon width={16} height={16} />
              </a>
            ) : null}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="rounded-md border border-border p-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <Mail size={16} />
              </a>
            ) : null}
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-start justify-between gap-2 text-xs text-foreground-faint sm:flex-row sm:items-center">
          <p>© {year} {profile?.full_name ?? "Geoffrey Akoo"}. All rights reserved.</p>
          <p className="text-meta">Built with React, TypeScript &amp; Supabase</p>
        </Container>
      </div>
    </footer>
  );
}
