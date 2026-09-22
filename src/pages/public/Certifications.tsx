import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listCertifications } from "@/services/certifications.service";
import { AsyncSection } from "@/components/shared/AsyncStates";

export default function Certifications() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["certifications"], queryFn: listCertifications });

  return (
    <Section>
      <SectionHeading
        eyebrow="Credentials & training"
        title="Certifications and learning"
        description="A distinction is maintained between verified certifications, structured training, and technical learning pathways represented in my portfolio."
      />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Credentials and training records will appear here once they are published."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-border bg-background-raised p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-foreground font-medium">{cert.name}</p>
                <span className="text-meta rounded-sm border border-border px-2 py-1 text-foreground-faint">
                  {cert.credential_url ? "Certification" : (cert.description?.toLowerCase().includes("learning") ? "Training" : "Course")}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground-muted">{cert.issuer}</p>
              {cert.issue_date ? (
                <p className="text-meta mt-2 text-foreground-faint">{new Date(cert.issue_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
              ) : null}
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
