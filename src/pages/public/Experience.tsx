import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listExperience } from "@/services/experience.service";
import { AsyncSection } from "@/components/shared/AsyncStates";

function formatRange(start: string, end: string | null) {
  const startYear = new Date(start).getFullYear();
  const endYear = end ? new Date(end).getFullYear() : "Present";
  return `${startYear} — ${endYear}`;
}

export default function Experience() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["experience"], queryFn: listExperience });

  return (
    <Section>
      <SectionHeading eyebrow="Timeline" title="Experience" />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Experience entries will appear here once published."
      >
        <ol className="space-y-10 border-l border-border pl-6">
          {data?.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-meta">{formatRange(item.start_date, item.end_date)}</p>
              <h3 className="text-heading-md mt-1 text-foreground">{item.position}</h3>
              <p className="text-sm text-foreground-muted">
                {item.organization}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              <p className="text-body mt-3 text-foreground-muted">{item.description}</p>
              {item.responsibilities?.length ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-foreground-muted">
                  {item.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : null}
              {item.technologies?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <li key={t} className="text-meta rounded-sm border border-border px-2 py-1">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </AsyncSection>
    </Section>
  );
}
