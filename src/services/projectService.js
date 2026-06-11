import { fallbackProjects } from '../data/fallbackProjects'
import { getProjectSlug, normalizeArray, slugify } from '../lib/utils'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const optionalTextFields = [
  'short_description',
  'overview',
  'problem',
  'solution',
  'result',
  'category',
  'thumbnail_url',
  'github_url',
  'demo_video_url',
  'documentation_url',
  'what_i_learned',
]

const arrayFields = ['features', 'tech_stack']
const numberFields = ['year', 'display_order']

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

function getAdminNotConfiguredError(action) {
  return `Supabase is not configured. ${action} uses real CMS data only.`
}

function getErrorMessage(error, fallback) {
  return error?.message || fallback
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = String(value).trim()
  return trimmedValue || null
}

function normalizeTextArray(value) {
  const items = normalizeArray(value)
    .map((item) => String(item).trim())
    .filter(Boolean)

  return items.length > 0 ? items : null
}

function normalizeOptionalNumber(value) {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : null
}

function normalizeOptionalBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase())
  }

  return Boolean(value)
}

function normalizeProjectInput(projectInput = {}, { includeDefaults = false } = {}) {
  const title = normalizeOptionalText(projectInput.title)

  if (!title) {
    return {
      payload: null,
      error: 'Project title is required.',
    }
  }

  const hasSlugInput = Object.prototype.hasOwnProperty.call(projectInput, 'slug')
  const inputSlug = hasSlugInput ? slugify(projectInput.slug) : ''
  const generatedSlug = slugify(title)
  const slug = inputSlug || generatedSlug || null
  const payload = {
    title,
    slug,
  }

  for (const field of optionalTextFields) {
    if (Object.prototype.hasOwnProperty.call(projectInput, field)) {
      payload[field] = normalizeOptionalText(projectInput[field])
    }
  }

  for (const field of arrayFields) {
    if (Object.prototype.hasOwnProperty.call(projectInput, field)) {
      payload[field] = normalizeTextArray(projectInput[field])
    }
  }

  for (const field of numberFields) {
    if (Object.prototype.hasOwnProperty.call(projectInput, field)) {
      payload[field] = normalizeOptionalNumber(projectInput[field])
    }
  }

  if (Object.prototype.hasOwnProperty.call(projectInput, 'is_featured') || includeDefaults) {
    payload.is_featured = normalizeOptionalBoolean(projectInput.is_featured, false)
  }

  if (Object.prototype.hasOwnProperty.call(projectInput, 'is_archived') || includeDefaults) {
    payload.is_archived = normalizeOptionalBoolean(projectInput.is_archived, false)
  }

  return {
    payload,
    error: null,
  }
}

function validateProjectId(id) {
  const projectId = normalizeOptionalText(id)

  if (!projectId) {
    return {
      projectId: null,
      error: 'Project id is required.',
    }
  }

  return {
    projectId,
    error: null,
  }
}

function validateScreenshotId(id) {
  const screenshotId = normalizeOptionalText(id)

  if (!screenshotId) {
    return {
      screenshotId: null,
      error: 'Screenshot id is required.',
    }
  }

  return {
    screenshotId,
    error: null,
  }
}

function normalizeScreenshotInput(input = {}) {
  const projectId = normalizeOptionalText(input.project_id)
  const imageUrl = normalizeOptionalText(input.image_url)

  if (!projectId) {
    return {
      payload: null,
      error: 'Project id is required for screenshots.',
    }
  }

  if (!imageUrl) {
    return {
      payload: null,
      error: 'Screenshot image URL is required.',
    }
  }

  return {
    payload: {
      project_id: projectId,
      image_url: imageUrl,
      caption: normalizeOptionalText(input.caption),
      display_order: normalizeOptionalNumber(input.display_order),
    },
    error: null,
  }
}

function normalizeScreenshotUpdateInput(input = {}) {
  const payload = {}

  if (Object.prototype.hasOwnProperty.call(input, 'caption')) {
    payload.caption = normalizeOptionalText(input.caption)
  }

  if (Object.prototype.hasOwnProperty.call(input, 'display_order')) {
    payload.display_order = normalizeOptionalNumber(input.display_order)
  }

  if (Object.keys(payload).length === 0) {
    return {
      payload: null,
      error: 'No screenshot fields were provided for update.',
    }
  }

  return {
    payload,
    error: null,
  }
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

export async function getAdminProjects() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      projects: [],
      error: getAdminNotConfiguredError('Admin project reading'),
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return {
        projects: [],
        error: error.message || 'Admin projects could not be loaded.',
      }
    }

    return {
      projects: Array.isArray(data) ? data : [],
      error: null,
    }
  } catch (error) {
    return {
      projects: [],
      error: error instanceof Error ? error.message : 'Admin projects could not be loaded.',
    }
  }
}

export async function getArchivedProjects() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      projects: [],
      error: getAdminNotConfiguredError('Archived project reading'),
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_archived', true)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        projects: [],
        error: getErrorMessage(error, 'Archived projects could not be loaded.'),
      }
    }

    return {
      projects: Array.isArray(data) ? data : [],
      error: null,
    }
  } catch (error) {
    return {
      projects: [],
      error: getErrorMessage(error, 'Archived projects could not be loaded.'),
    }
  }
}

export async function getAdminProjectById(id) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      project: null,
      error: getAdminNotConfiguredError('Admin project reading'),
    }
  }

  const { projectId, error: idError } = validateProjectId(id)

  if (idError) {
    return {
      project: null,
      error: idError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle()

    if (error) {
      return {
        project: null,
        error: getErrorMessage(error, 'Admin project could not be loaded.'),
      }
    }

    return {
      project: data ?? null,
      error: null,
    }
  } catch (error) {
    return {
      project: null,
      error: getErrorMessage(error, 'Admin project could not be loaded.'),
    }
  }
}

export async function createProject(projectInput) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      project: null,
      error: getAdminNotConfiguredError('Project creation'),
    }
  }

  const { payload, error: inputError } = normalizeProjectInput(projectInput, { includeDefaults: true })

  if (inputError) {
    return {
      project: null,
      error: inputError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return {
        project: null,
        error: getErrorMessage(error, 'Project could not be created.'),
      }
    }

    return {
      project: data,
      error: null,
    }
  } catch (error) {
    return {
      project: null,
      error: getErrorMessage(error, 'Project could not be created.'),
    }
  }
}

export async function updateProject(id, projectInput) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      project: null,
      error: getAdminNotConfiguredError('Project updating'),
    }
  }

  const { projectId, error: idError } = validateProjectId(id)

  if (idError) {
    return {
      project: null,
      error: idError,
    }
  }

  const { payload, error: inputError } = normalizeProjectInput(projectInput)

  if (inputError) {
    return {
      project: null,
      error: inputError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', projectId)
      .select('*')
      .maybeSingle()

    if (error) {
      return {
        project: null,
        error: getErrorMessage(error, 'Project could not be updated.'),
      }
    }

    if (!data) {
      return {
        project: null,
        error: 'Project was not found or could not be updated.',
      }
    }

    return {
      project: data,
      error: null,
    }
  } catch (error) {
    return {
      project: null,
      error: getErrorMessage(error, 'Project could not be updated.'),
    }
  }
}

async function updateProjectArchiveState(id, isArchived) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      project: null,
      error: getAdminNotConfiguredError('Project archive updates'),
    }
  }

  const { projectId, error: idError } = validateProjectId(id)

  if (idError) {
    return {
      project: null,
      error: idError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ is_archived: isArchived })
      .eq('id', projectId)
      .select('*')
      .maybeSingle()

    if (error) {
      return {
        project: null,
        error: getErrorMessage(error, 'Project archive state could not be updated.'),
      }
    }

    if (!data) {
      return {
        project: null,
        error: 'Project was not found or could not be updated.',
      }
    }

    return {
      project: data,
      error: null,
    }
  } catch (error) {
    return {
      project: null,
      error: getErrorMessage(error, 'Project archive state could not be updated.'),
    }
  }
}

export async function archiveProject(id) {
  return updateProjectArchiveState(id, true)
}

export async function restoreProject(id) {
  return updateProjectArchiveState(id, false)
}

export async function deleteProjectPermanently(id) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: getAdminNotConfiguredError('Permanent project deletion'),
    }
  }

  const { projectId, error: idError } = validateProjectId(id)

  if (idError) {
    return {
      success: false,
      error: idError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .select('id')
      .maybeSingle()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Project could not be deleted.'),
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Project was not found or could not be deleted.',
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Project could not be deleted.'),
    }
  }
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
  const { projectId: normalizedProjectId, error: idError } = validateProjectId(projectId)

  if (idError || !isSupabaseConfigured || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('project_screenshots')
      .select('*')
      .eq('project_id', normalizedProjectId)
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })

    if (error) {
      if (import.meta.env.DEV) {
        console.warn('[Supabase] Failed to fetch project screenshots.', error)
      }

      return []
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Supabase] Failed to fetch project screenshots.', error)
    }

    return []
  }
}

export async function getAdminProjectScreenshots(projectId) {
  return getProjectScreenshots(projectId)
}

export async function addProjectScreenshot(input) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      screenshot: null,
      error: getAdminNotConfiguredError('Screenshot creation'),
    }
  }

  const { payload, error: inputError } = normalizeScreenshotInput(input)

  if (inputError) {
    return {
      screenshot: null,
      error: inputError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('project_screenshots')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return {
        screenshot: null,
        error: getErrorMessage(error, 'Project screenshot could not be created.'),
      }
    }

    return {
      screenshot: data,
      error: null,
    }
  } catch (error) {
    return {
      screenshot: null,
      error: getErrorMessage(error, 'Project screenshot could not be created.'),
    }
  }
}

export async function updateProjectScreenshot(id, input) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      screenshot: null,
      error: getAdminNotConfiguredError('Screenshot updating'),
    }
  }

  const { screenshotId, error: idError } = validateScreenshotId(id)

  if (idError) {
    return {
      screenshot: null,
      error: idError,
    }
  }

  const { payload, error: inputError } = normalizeScreenshotUpdateInput(input)

  if (inputError) {
    return {
      screenshot: null,
      error: inputError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('project_screenshots')
      .update(payload)
      .eq('id', screenshotId)
      .select('*')
      .maybeSingle()

    if (error) {
      return {
        screenshot: null,
        error: getErrorMessage(error, 'Project screenshot could not be updated.'),
      }
    }

    if (!data) {
      return {
        screenshot: null,
        error: 'Project screenshot was not found or could not be updated.',
      }
    }

    return {
      screenshot: data,
      error: null,
    }
  } catch (error) {
    return {
      screenshot: null,
      error: getErrorMessage(error, 'Project screenshot could not be updated.'),
    }
  }
}

export async function deleteProjectScreenshot(id) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: getAdminNotConfiguredError('Screenshot deletion'),
    }
  }

  const { screenshotId, error: idError } = validateScreenshotId(id)

  if (idError) {
    return {
      success: false,
      error: idError,
    }
  }

  try {
    const { data, error } = await supabase
      .from('project_screenshots')
      .delete()
      .eq('id', screenshotId)
      .select('id')
      .maybeSingle()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Project screenshot could not be deleted.'),
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Project screenshot was not found or could not be deleted.',
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Project screenshot could not be deleted.'),
    }
  }
}
