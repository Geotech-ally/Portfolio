import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";

export interface ProjectWithRelations extends Project {
  project_images: { id: string; image_path: string; caption: string | null; sort_order: number }[];
  project_technologies: { technology: string }[];
}

/** Public: published projects only, RLS enforces this independently. */
export async function listPublishedProjects(options?: { featuredOnly?: boolean }): Promise<ProjectWithRelations[]> {
  let query = supabase
    .from("projects")
    .select("*, project_images(*), project_technologies(technology)")
    .eq("content_status", "published")
    .order("sort_order", { ascending: true });

  if (options?.featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProjectWithRelations[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*), project_technologies(technology)")
    .eq("slug", slug)
    .eq("content_status", "published")
    .maybeSingle();
  if (error) throw error;
  return data as ProjectWithRelations | null;
}

/** Admin only — RLS rejects this for non-admin sessions regardless of UI state. */
export async function listAllProjectsForAdmin(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProject(input: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase.from("projects").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase.from("projects").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
