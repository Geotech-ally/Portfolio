import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listCertifications } from "@/services/certifications.service";
import { AsyncSection } from "@/components/shared/AsyncStates";

export default function Certifications() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["certifications"], queryFn: listCertifications });

  return (
    <Section>
      <SectionHeading eyebrow="Credentials" title="Certifications" />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Certifications will appear here once published."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-border p-6">
              <p className="text-foreground font-medium">{cert.name}</p>
              <p className="text-sm text-foreground-muted">{cert.issuer}</p>
              <p className="text-meta mt-2">{new Date(cert.issue_date).getFullYear()}</p>
              {cert.description ? <p className="text-body mt-3 text-sm text-foreground-muted">{cert.description}</p> : null}
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary"
                >
                  Verify <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </AsyncSection>
    </Section>
  );
}
