import { supabase } from "@/lib/supabase";
import type { Skill, SkillCategory } from "@/types/database";

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

export async function listSkillCategories(): Promise<SkillCategoryWithSkills[]> {
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*, skills(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SkillCategoryWithSkills[];
}
