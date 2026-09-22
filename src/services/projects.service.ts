import { supabase } from "@/lib/supabase";
import { VERIFIED_PROJECTS } from "@/content/verified-content";
import type { Project } from "@/types/database";

export interface ProjectWithRelations extends Project {
  project_images: { id: string; image_path: string; caption: string | null; sort_order: number }[];
  project_technologies: { technology: string }[];
}

const normalizeSlug = (slug: string) => {
  const aliases: Record<string, string> = {
    "saas-analytics-dashboard": "saas-analytics",
    "saas-analytics": "saas-analytics",
    "nexacare-hms": "health",
    "health": "health",
    "personal-portfolio": "portfolio",
    "portfolio": "portfolio",
    "siaya-community-digital-hub-learning-platform": "siaya-community-digital-hub",
    "siaya-community-digital-hub": "siaya-community-digital-hub",
    "smart-voting-system": "smart-voting-system",
  };

  return aliases[slug] ?? slug;
};

const projectFallbackList = VERIFIED_PROJECTS.map((project) => ({
  ...project,
  full_description: project.full_description,
  problem: project.problem,
  solution: project.solution,
  role: project.role,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  cover_image_path: null,
  featured: project.featured,
  live_url: project.live_url,
  github_url: project.github_url,
  sort_order: project.sort_order,
  content_status: project.content_status,
  status: project.status,
  short_description: project.short_description,
  title: project.title,
  slug: project.slug,
}));

/** Public: published projects only, RLS enforces this independently. */
export async function listPublishedProjects(options?: { featuredOnly?: boolean }): Promise<ProjectWithRelations[]> {
  try {
    let query = supabase
      .from("projects")
      .select("*, project_images(*), project_technologies(technology)")
      .eq("content_status", "published")
      .order("sort_order", { ascending: true });

    if (options?.featuredOnly) {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;
    if (error) {
      if (error.code === "42P01") {
        return projectFallbackList as ProjectWithRelations[];
      }
      throw error;
    }
    return (data ?? projectFallbackList) as ProjectWithRelations[];
  } catch {
    return projectFallbackList as ProjectWithRelations[];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const normalized = normalizeSlug(slug);

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_images(*), project_technologies(technology)")
      .eq("slug", normalized)
      .eq("content_status", "published")
      .maybeSingle();
    if (error) {
      if (error.code === "42P01") {
        const match = projectFallbackList.find((project) => normalizeSlug(project.slug) === normalized) ?? projectFallbackList[0];
        return (match ?? null) as ProjectWithRelations | null;
      }
      throw error;
    }
    return (data ?? projectFallbackList.find((project) => normalizeSlug(project.slug) === normalized) ?? null) as ProjectWithRelations | null;
  } catch {
    const match = projectFallbackList.find((project) => normalizeSlug(project.slug) === normalized) ?? projectFallbackList[0];
    return (match ?? null) as ProjectWithRelations | null;
  }
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
