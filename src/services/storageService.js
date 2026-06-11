import { slugify } from '../lib/utils'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const MEDIA_BUCKETS = new Set(['project-thumbnails', 'project-screenshots'])

function getNotConfiguredError(action) {
  return {
    publicUrl: null,
    path: null,
    error: `Supabase is not configured. ${action} requires a configured Supabase client.`,
  }
}

function getBucketError(bucket) {
  return `Bucket "${bucket}" is not available for project media.`
}

function sanitizeFileName(fileName) {
  const rawName = String(fileName || '').trim().toLowerCase()
  const lastDotIndex = rawName.lastIndexOf('.')
  const hasExtension = lastDotIndex > 0 && lastDotIndex < rawName.length - 1

  const baseName = hasExtension ? rawName.slice(0, lastDotIndex) : rawName
  const extension = hasExtension ? rawName.slice(lastDotIndex + 1) : ''

  const safeBaseName = slugify(baseName) || 'file'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '')

  return safeExtension ? `${safeBaseName}.${safeExtension}` : safeBaseName
}

function normalizeProjectFolder(projectId) {
  const folder = String(projectId || '').trim()
  return folder ? folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'temp' : 'temp'
}

function buildStoragePath(fileName, projectId) {
  const timestamp = Date.now()
  const safeFileName = sanitizeFileName(fileName)
  const safeProjectFolder = normalizeProjectFolder(projectId)

  return `${safeProjectFolder}/${timestamp}-${safeFileName}`
}

function validateImageFile(file) {
  if (!file) {
    return 'A file is required.'
  }

  if (typeof File !== 'undefined' && !(file instanceof File)) {
    return 'The provided value is not a valid file.'
  }

  if (!String(file.type || '').startsWith('image/')) {
    return 'Only image files are allowed.'
  }

  if (typeof file.size === 'number' && file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image files must be 5 MB or smaller.'
  }

  return null
}

function validateMediaBucket(bucket) {
  if (!bucket || typeof bucket !== 'string') {
    return 'A storage bucket is required.'
  }

  if (!MEDIA_BUCKETS.has(bucket)) {
    return getBucketError(bucket)
  }

  return null
}

function getUploadResult(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return {
    publicUrl: data?.publicUrl ?? null,
    path,
    error: null,
  }
}

async function uploadImageToBucket(bucket, file, projectId) {
  if (!isSupabaseConfigured || !supabase) {
    return getNotConfiguredError(`Uploading to ${bucket}`)
  }

  const bucketError = validateMediaBucket(bucket)
  if (bucketError) {
    return { publicUrl: null, path: null, error: bucketError }
  }

  const fileError = validateImageFile(file)
  if (fileError) {
    return { publicUrl: null, path: null, error: fileError }
  }

  const path = buildStoragePath(file.name, projectId)

  try {
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

    if (error) {
      return {
        publicUrl: null,
        path: null,
        error: error.message || `Failed to upload file to ${bucket}.`,
      }
    }

    return getUploadResult(bucket, path)
  } catch (error) {
    return {
      publicUrl: null,
      path: null,
      error: error instanceof Error ? error.message : `Failed to upload file to ${bucket}.`,
    }
  }
}

export async function uploadProjectThumbnail(file, projectId) {
  return uploadImageToBucket('project-thumbnails', file, projectId)
}

export async function uploadProjectScreenshot(file, projectId) {
  return uploadImageToBucket('project-screenshots', file, projectId)
}

export async function deleteStorageFile(bucket, pathOrUrl) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Deleting storage files requires a configured Supabase client.',
    }
  }

  const bucketError = validateMediaBucket(bucket)
  if (bucketError) {
    return { success: false, error: bucketError }
  }

  const trimmedPathOrUrl = String(pathOrUrl || '').trim()
  const storagePath = trimmedPathOrUrl.startsWith('http')
    ? getStoragePathFromPublicUrl(trimmedPathOrUrl, bucket)
    : trimmedPathOrUrl

  if (!storagePath) {
    return {
      success: false,
      error: trimmedPathOrUrl.startsWith('http')
        ? 'Could not determine the storage path from the public URL.'
        : 'A storage file path or public URL is required.',
    }
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([storagePath])

    if (error) {
      return {
        success: false,
        error: error.message || `Failed to delete file from ${bucket}.`,
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to delete file from ${bucket}.`,
    }
  }
}

export function getStoragePathFromPublicUrl(url, bucket) {
  if (!url || !bucket || typeof url !== 'string' || typeof bucket !== 'string') {
    return null
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    return null
  }

  try {
    const bucketMarker = `/object/public/${bucket}/`
    const markerIndex = trimmedUrl.indexOf(bucketMarker)

    if (markerIndex >= 0) {
      const pathPart = trimmedUrl.slice(markerIndex + bucketMarker.length)
      return decodeURIComponent(pathPart.split(/[?#]/)[0] || '').trim() || null
    }

    const parsedUrl = new URL(trimmedUrl)
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
    const bucketIndex = pathSegments.findIndex(
      (segment, index) =>
        segment === 'public' &&
        pathSegments[index - 1] === 'object' &&
        pathSegments[index - 2] === 'v1' &&
        pathSegments[index - 3] === 'storage' &&
        pathSegments[index + 1] === bucket,
    )

    if (bucketIndex >= 0) {
      const pathSegmentsAfterBucket = pathSegments.slice(bucketIndex + 2)
      const path = pathSegmentsAfterBucket.join('/')
      return decodeURIComponent(path).trim() || null
    }
  } catch {
    return null
  }

  return null
}
