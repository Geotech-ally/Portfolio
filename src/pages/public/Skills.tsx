import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/layout/Section";
import { listSkillCategories } from "@/services/skills.service";
import { AsyncSection } from "@/components/shared/AsyncStates";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function Skills() {
  usePageMetadata({
    title: "Skills | Geoffrey Akoo",
    description: "Skills and technical capabilities of Geoffrey Akoo across frontend, backend, databases, infrastructure and cybersecurity.",
    path: "/skills",
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["skills"], queryFn: listSkillCategories });

  return (
    <Section>
      <SectionHeading
        eyebrow="Capabilities"
        title="Skills"
        description="Technical capability areas built around secure systems, full-stack product work and practical operations."
      />
      <AsyncSection
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.length === 0}
        emptyTitle="Skill categories will appear here once published."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((category) => (
            <div key={category.id} className="border-t border-border-strong pt-4">
              <p className="font-medium text-foreground">{category.name}</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                {category.skills.map((skill) => (
                  <li key={skill.id} className="flex flex-col">
                    <span>{skill.name}</span>
                    {skill.proficiency_note ? (
                      <span className="text-meta text-xs">{skill.proficiency_note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AsyncSection>
    </Section>
  );
}
