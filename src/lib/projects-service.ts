import { projects as localProjects, type Project } from "@/config/portfolio";
import { supabase } from "@/lib/supabase";

export interface SupabaseProjectRow {
  id: string;
  title: string;
  slug?: string | null;
  short_description?: string | null;
  overview?: string | null;
  problem?: string | null;
  solution?: string | null;
  result?: string | null;
  features?: string[] | null;
  tech_stack?: string[] | null;
  category?: string | null;
  year?: number | null;
  thumbnail_url?: string | null;
  github_url?: string | null;
  demo_video_url?: string | null;
  documentation_url?: string | null;
  what_i_learned?: string | null;
  is_featured?: boolean | null;
  display_order?: number | null;
  is_archived?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export function mapSupabaseProjectToFolio(row: SupabaseProjectRow): Project {
  const description: string[] = [];
  if (row.overview?.trim()) description.push(row.overview.trim());
  if (row.problem?.trim()) description.push(row.problem.trim());
  if (row.solution?.trim()) description.push(row.solution.trim());
  if (row.result?.trim()) description.push(row.result.trim());
  if (description.length === 0) {
    if (row.short_description?.trim()) description.push(row.short_description.trim());
    else description.push(row.title);
  }

  const image =
    row.thumbnail_url && row.thumbnail_url !== "#"
      ? row.thumbnail_url
      : row.slug
        ? `/images/projects/${row.slug}.svg`
        : "/images/projects/placeholder.svg";

  return {
    slug: row.slug || row.id,
    title: row.title,
    summary: row.short_description || row.overview || "",
    description,
    image,
    tech: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    year: row.year ? String(row.year) : "2026",
    status: row.is_archived ? "archived" : "live",
    featured: Boolean(row.is_featured),
    links: {
      live: row.demo_video_url && row.demo_video_url !== "#" ? row.demo_video_url : undefined,
      repo: row.github_url && row.github_url !== "#" ? row.github_url : undefined,
      caseStudy:
        row.documentation_url && row.documentation_url !== "#"
          ? row.documentation_url
          : undefined,
    },
    highlights:
      Array.isArray(row.features) && row.features.length > 0 ? row.features : undefined,
    proudest: row.what_i_learned || undefined,
  };
}

/**
 * Fetch all public, non-archived projects.
 * Attempts Supabase query first; falls back seamlessly to local portfolio.ts.
 */
export async function getPublicProjects(): Promise<Project[]> {
  if (!supabase) {
    return [...localProjects];
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_archived", false)
      .order("display_order", { ascending: true, nullsFirst: false });

    if (error || !data || data.length === 0) {
      return [...localProjects];
    }

    return data.map(mapSupabaseProjectToFolio);
  } catch (err) {
    console.warn("[projects-service] Supabase query failed, falling back to local:", err);
    return [...localProjects];
  }
}

/**
 * Fetch a single project by its slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!supabase) {
    return localProjects.find((p) => p.slug === slug);
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return localProjects.find((p) => p.slug === slug);
    }

    return mapSupabaseProjectToFolio(data);
  } catch {
    return localProjects.find((p) => p.slug === slug);
  }
}

/**
 * Admin operations — shared with portfoliowindows database.
 */
export async function getAdminProjects(): Promise<{
  projects: SupabaseProjectRow[];
  error: string | null;
}> {
  if (!supabase) {
    return { projects: [], error: "Supabase is not configured." };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false });

    if (error) return { projects: [], error: error.message };
    return { projects: data || [], error: null };
  } catch (err) {
    return {
      projects: [],
      error: err instanceof Error ? err.message : "Failed to load projects.",
    };
  }
}

export async function archiveProject(
  id: string,
  isArchived: boolean,
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: "Supabase not configured." };
  const { error } = await supabase
    .from("projects")
    .update({ is_archived: isArchived })
    .eq("id", id);
  return { ok: !error, error: error ? error.message : null };
}

export async function toggleFeaturedProject(
  id: string,
  isFeatured: boolean,
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: "Supabase not configured." };
  const { error } = await supabase
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", id);
  return { ok: !error, error: error ? error.message : null };
}

export async function deleteProject(
  id: string,
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: "Supabase not configured." };
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return { ok: !error, error: error ? error.message : null };
}

export async function saveProject(
  project: Partial<SupabaseProjectRow>,
): Promise<{ ok: boolean; project?: SupabaseProjectRow; error: string | null }> {
  if (!supabase) return { ok: false, error: "Supabase not configured." };

  if (project.id) {
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", project.id)
      .select()
      .single();
    return { ok: !error, project: data, error: error?.message || null };
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();
    return { ok: !error, project: data, error: error?.message || null };
  }
}

export async function uploadProjectThumbnail(
  file: File,
  projectId: string,
): Promise<{ publicUrl: string | null; error: string | null }> {
  if (!supabase) return { publicUrl: null, error: "Supabase not configured." };

  try {
    const ext = file.name.split(".").pop() || "png";
    const path = `${projectId || "temp"}/${Date.now()}-thumbnail.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("project-thumbnails")
      .upload(path, file, { upsert: true });

    if (uploadError) return { publicUrl: null, error: uploadError.message };

    const { data } = supabase.storage.from("project-thumbnails").getPublicUrl(path);
    return { publicUrl: data.publicUrl, error: null };
  } catch (err) {
    return {
      publicUrl: null,
      error: err instanceof Error ? err.message : "Upload failed.",
    };
  }
}
