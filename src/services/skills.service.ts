import { supabase } from "@/lib/supabase";
import { VERIFIED_SKILL_GROUPS } from "@/content/verified-content";
import type { Skill, SkillCategory } from "@/types/database";

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

export async function listSkillCategories(): Promise<SkillCategoryWithSkills[]> {
  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*, skills(*)")
      .order("sort_order", { ascending: true });
    if (error) {
      if (error.code === "42P01") {
        return VERIFIED_SKILL_GROUPS.map((group, index) => ({
          id: `skill-group-${index}`,
          name: group.title,
          slug: group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sort_order: index + 1,
          created_at: new Date().toISOString(),
          skills: group.technologies.map((name, skillIndex) => ({
            id: `skill-${index}-${skillIndex}`,
            category_id: `skill-group-${index}`,
            name,
            proficiency_note: null,
            sort_order: skillIndex + 1,
            created_at: new Date().toISOString(),
          })),
        }));
      }
      throw error;
    }
    return (data ?? []) as SkillCategoryWithSkills[];
  } catch {
    return VERIFIED_SKILL_GROUPS.map((group, index) => ({
      id: `skill-group-${index}`,
      name: group.title,
      slug: group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sort_order: index + 1,
      created_at: new Date().toISOString(),
      skills: group.technologies.map((name, skillIndex) => ({
        id: `skill-${index}-${skillIndex}`,
        category_id: `skill-group-${index}`,
        name,
        proficiency_note: null,
        sort_order: skillIndex + 1,
        created_at: new Date().toISOString(),
      })),
    }));
  }
}
