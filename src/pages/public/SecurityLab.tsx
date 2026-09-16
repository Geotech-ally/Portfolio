import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listPublishedWriteups } from "@/services/security.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { cn } from "@/lib/utils";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-danger",
  high: "text-danger",
  medium: "text-warning",
  low: "text-secondary",
  info: "text-foreground-muted",
};

export default function SecurityLab() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["security-writeups", page],
    queryFn: () => listPublishedWriteups(page),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Security Lab"
        title="Writeups & research"
        description="Defensive analysis, tooling notes and methodology from network security, web security, Linux hardening and CTF practice. No credentials, private targets, or step-by-step exploit instructions are published here."
      />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.writeups.length === 0}
        emptyTitle="Security writeups will appear here once published."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.writeups.map((w) => (
            <Link key={w.id} to={`/security-lab/${w.slug}`} className="rounded-lg border border-border p-6 transition-colors hover:border-primary">
              <div className="flex items-center justify-between">
                <p className="text-meta">{w.category}</p>
                {w.severity ? (
                  <span className={cn("text-meta", SEVERITY_COLOR[w.severity])}>{w.severity}</span>
                ) : null}
              </div>
              <h3 className="text-heading-md mt-2 text-foreground">{w.title}</h3>
              <p className="text-body mt-2 text-sm text-foreground-muted">{w.summary}</p>
            </Link>
          ))}
        </div>
        {data && data.total > 9 ? (
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md border border-border-strong px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={(page + 1) * 9 >= data.total}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-border-strong px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </AsyncSection>
    </Section>
  );
}
