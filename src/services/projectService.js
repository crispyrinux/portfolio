import { fallbackProjects } from '../data/fallbackProjects'
import { getProjectSlug, slugify } from '../lib/utils'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function getVisibleFallbackProjects() {
  return [...fallbackProjects]
    .filter((project) => project.is_archived !== true)
    .sort((a, b) => {
      const firstOrder = a.display_order ?? Number.MAX_SAFE_INTEGER
      const secondOrder = b.display_order ?? Number.MAX_SAFE_INTEGER

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder
      }

      return getProjectSlug(a).localeCompare(getProjectSlug(b))
    })
}

function buildProjectsQuery(orderClauses = []) {
  let query = supabase.from('projects').select('*').eq('is_archived', false)

  for (const clause of orderClauses) {
    query = query.order(clause.column, {
      ascending: clause.ascending,
      nullsFirst: false,
    })
  }

  return query
}

async function fetchProjectsWithFallbackOrder(orderClausesList) {
  let lastError = null

  for (const orderClauses of orderClausesList) {
    try {
      const { data, error } = await buildProjectsQuery(orderClauses)

      if (error) {
        throw error
      }

      if (Array.isArray(data) && data.length > 0) {
        return data
      }

      return null
    } catch (error) {
      lastError = error
    }
  }

  if (import.meta.env.DEV && lastError) {
    console.warn('[Supabase] Failed to fetch public projects. Using fallback data.', lastError)
  }

  return null
}

export async function getPublicProjects() {
  if (!isSupabaseConfigured || !supabase) {
    return getVisibleFallbackProjects()
  }

  const projects =
    (await fetchProjectsWithFallbackOrder([
      [
        { column: 'display_order', ascending: true },
        { column: 'created_at', ascending: false },
      ],
      [{ column: 'created_at', ascending: false }],
      [{ column: 'display_order', ascending: true }],
      [],
    ])) ?? getVisibleFallbackProjects()

  return projects.length > 0 ? projects : getVisibleFallbackProjects()
}

export async function getProjectBySlug(slug) {
  const routeSlug = slugify(slug)

  if (!routeSlug) {
    return null
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', routeSlug)
        .eq('is_archived', false)
        .maybeSingle()

      if (error && import.meta.env.DEV) {
        console.warn('[Supabase] Failed to fetch project by slug. Falling back to local data.', error)
      }

      if (!error && data) {
        return data
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[Supabase] Failed to fetch project by slug. Falling back to local data.', error)
      }
    }
  }

  return fallbackProjects.find(
    (project) => project.is_archived !== true && slugify(getProjectSlug(project)) === routeSlug,
  ) ?? null
}

export async function getProjectScreenshots(projectId) {
  void projectId

  // Will be implemented later after the project_screenshots table or storage bucket is ready.
  return []
}
