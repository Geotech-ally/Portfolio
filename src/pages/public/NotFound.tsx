import { Section } from "@/components/layout/Section";
import { LinkButton } from "@/components/ui/link-button";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function NotFound() {
  usePageMetadata({
    title: "Page Not Found | Geoffrey Akoo",
    description: "The requested page could not be found.",
    path: "/404",
  });

  return (
    <Section>
      <div className="max-w-lg rounded-lg border border-border bg-background-raised p-8">
        <p className="text-meta mb-3">404</p>
        <h1 className="text-heading-lg text-foreground">Page not found</h1>
        <p className="text-body mt-3 text-foreground-muted">
          The page you were looking for does not exist or may have moved. You can return home or head directly to the project portfolio.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton to="/">Back Home</LinkButton>
          <LinkButton to="/projects" variant="secondary">View Projects</LinkButton>
        </div>
      </div>
    </Section>
  );
}
