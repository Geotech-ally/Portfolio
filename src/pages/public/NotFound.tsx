import { Section } from "@/components/layout/Section";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <Section>
      <div className="max-w-md">
        <p className="text-meta mb-3">404</p>
        <h1 className="text-heading-lg text-foreground">Page not found</h1>
        <p className="text-body mt-3 text-foreground-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-6">
          <LinkButton to="/">Back to home</LinkButton>
        </div>
      </div>
    </Section>
  );
}
