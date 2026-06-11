import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import {
  addProjectScreenshot,
  createProject,
  deleteProjectScreenshot,
  getAdminProjectById,
  getAdminProjectScreenshots,
  updateProject,
} from '../services/projectService'
import { deleteStorageFile, uploadProjectScreenshot, uploadProjectThumbnail } from '../services/storageService'

const THUMBNAIL_BUCKET = 'project-thumbnails'
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

const initialFormState = {
  title: '',
  slug: '',
  short_description: '',
  overview: '',
  problem: '',
  solution: '',
  result: '',
  features: '',
  tech_stack: '',
  category: '',
  year: '',
  github_url: '',
  demo_video_url: '',
  documentation_url: '',
  what_i_learned: '',
  is_featured: false,
  display_order: '',
  thumbnail_url: '',
}

function FieldGroup({ title, description, children }) {
  return (
    <section className="border border-slate-800 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p> : null}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  )
}

function TextInput({ id, label, value, onChange, required = false, type = 'text', placeholder, helperText }) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required ? <span className="text-cyan-200"> *</span> : null}
      </span>
      <input
        className="border border-slate-800 bg-[#05070b] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/50"
        id={id}
        name={id}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {helperText ? <span className="text-xs leading-5 text-slate-500">{helperText}</span> : null}
    </label>
  )
}

function TextArea({ id, label, value, onChange, rows = 4, placeholder, helperText }) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <textarea
        className="min-h-28 resize-y border border-slate-800 bg-[#05070b] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/50"
        id={id}
        name={id}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      {helperText ? <span className="text-xs leading-5 text-slate-500">{helperText}</span> : null}
    </label>
  )
}

function stringifyArrayField(value) {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return value ?? ''
}

function getStringValue(value) {
  return value === null || value === undefined ? '' : String(value)
}

function validateImageFile(file, label) {
  if (!file) {
    return null
  }

  if (!String(file.type || '').startsWith('image/')) {
    return `${label} must be an image file.`
  }

  if (typeof file.size === 'number' && file.size > MAX_IMAGE_SIZE_BYTES) {
    return `${label} must be 5 MB or smaller.`
  }

  return null
}

function validateThumbnailFile(file) {
  return validateImageFile(file, 'Thumbnail')
}

function validateScreenshotFile(file) {
  return validateImageFile(file, 'Screenshot')
}

function getScreenshotImageUrl(screenshot) {
  return screenshot?.image_url || screenshot?.url || ''
}

function mapProjectToFormState(project) {
  return {
    title: getStringValue(project.title),
    slug: getStringValue(project.slug),
    short_description: getStringValue(project.short_description),
    overview: getStringValue(project.overview),
    problem: getStringValue(project.problem),
    solution: getStringValue(project.solution),
    result: getStringValue(project.result),
    features: stringifyArrayField(project.features),
    tech_stack: stringifyArrayField(project.tech_stack),
    category: getStringValue(project.category),
    year: getStringValue(project.year),
    github_url: getStringValue(project.github_url),
    demo_video_url: getStringValue(project.demo_video_url),
    documentation_url: getStringValue(project.documentation_url),
    what_i_learned: getStringValue(project.what_i_learned),
    is_featured: project.is_featured === true,
    display_order: getStringValue(project.display_order),
    thumbnail_url: getStringValue(project.thumbnail_url),
  }
}

export default function ProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const screenshotInputRef = useRef(null)
  const [formData, setFormData] = useState(initialFormState)
  const [isLoadingProject, setIsLoadingProject] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const [screenshotError, setScreenshotError] = useState(null)
  const [screenshotSuccessMessage, setScreenshotSuccessMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('')
  const [screenshotFiles, setScreenshotFiles] = useState([])
  const [screenshots, setScreenshots] = useState([])
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false)
  const [isUploadingScreenshots, setIsUploadingScreenshots] = useState(false)
  const [deletingScreenshotId, setDeletingScreenshotId] = useState(null)

  useEffect(() => {
    if (!isEditMode) {
      setFormData(initialFormState)
      setIsLoadingProject(false)
      setLoadError(null)
      setNotFound(false)
      setThumbnailFile(null)
      setThumbnailPreviewUrl('')
      setThumbnailError(null)
      setScreenshotFiles([])
      setScreenshots([])
      setScreenshotError(null)
      setScreenshotSuccessMessage(null)
      setIsLoadingScreenshots(false)
      return
    }

    let isMounted = true

    async function loadProject() {
      setIsLoadingProject(true)
      setLoadError(null)
      setNotFound(false)

      const result = await getAdminProjectById(id)

      if (!isMounted) {
        return
      }

      if (result.error) {
        setLoadError(result.error)
        setIsLoadingProject(false)
        return
      }

      if (!result.project) {
        setNotFound(true)
        setIsLoadingProject(false)
        return
      }

      setFormData(mapProjectToFormState(result.project))
      setThumbnailFile(null)
      setThumbnailPreviewUrl('')
      setThumbnailError(null)
      setIsLoadingProject(false)
    }

    loadProject()

    return () => {
      isMounted = false
    }
  }, [id, isEditMode])

  useEffect(() => {
    if (!isEditMode || !id) {
      setScreenshots([])
      setScreenshotFiles([])
      setScreenshotError(null)
      setScreenshotSuccessMessage(null)
      setIsLoadingScreenshots(false)
      return
    }

    let isMounted = true

    async function loadScreenshots() {
      setIsLoadingScreenshots(true)
      setScreenshotError(null)

      const nextScreenshots = await getAdminProjectScreenshots(id)

      if (!isMounted) {
        return
      }

      setScreenshots(nextScreenshots)
      setIsLoadingScreenshots(false)
    }

    loadScreenshots()

    return () => {
      isMounted = false
    }
  }, [id, isEditMode])

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl('')
      return undefined
    }

    const objectUrl = URL.createObjectURL(thumbnailFile)
    setThumbnailPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [thumbnailFile])

  function handleChange(event) {
    const { checked, name, type, value } = event.target

    if (name === 'title' && value.trim()) {
      setValidationError(null)
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleThumbnailChange(event) {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      setThumbnailFile(null)
      setThumbnailError(null)
      return
    }

    const fileError = validateThumbnailFile(file)

    if (fileError) {
      setThumbnailFile(null)
      setThumbnailPreviewUrl('')
      setThumbnailError(fileError)
      event.target.value = ''
      return
    }

    setThumbnailError(null)
    setThumbnailFile(file)
  }

  function handleScreenshotFilesChange(event) {
    const files = Array.from(event.target.files ?? [])

    setScreenshotError(null)
    setScreenshotSuccessMessage(null)
    setScreenshotFiles(files)
  }

  async function refreshScreenshots() {
    if (!isEditMode || !id) {
      setScreenshots([])
      return []
    }

    const nextScreenshots = await getAdminProjectScreenshots(id)
    setScreenshots(nextScreenshots)
    return nextScreenshots
  }

  async function handleUploadScreenshots() {
    setScreenshotError(null)
    setScreenshotSuccessMessage(null)

    if (!isEditMode || !id) {
      setScreenshotError('Save the project first, then edit it to add screenshots.')
      return
    }

    if (screenshotFiles.length === 0) {
      setScreenshotError('Select at least one screenshot image to upload.')
      return
    }

    setIsUploadingScreenshots(true)

    let uploadedCount = 0
    const failures = []

    for (const file of screenshotFiles) {
      const fileError = validateScreenshotFile(file)

      if (fileError) {
        failures.push(`${file.name || 'Screenshot'}: ${fileError}`)
        continue
      }

      const uploadResult = await uploadProjectScreenshot(file, id)

      if (uploadResult.error) {
        failures.push(`${file.name || 'Screenshot'}: ${uploadResult.error}`)
        continue
      }

      const insertResult = await addProjectScreenshot({
        project_id: id,
        image_url: uploadResult.publicUrl,
        caption: null,
        display_order: null,
      })

      if (insertResult.error) {
        failures.push(`${file.name || 'Screenshot'}: ${insertResult.error}`)
        continue
      }

      uploadedCount += 1
    }

    await refreshScreenshots()

    if (uploadedCount > 0) {
      setScreenshotFiles([])

      if (screenshotInputRef.current) {
        screenshotInputRef.current.value = ''
      }

      setScreenshotSuccessMessage(
        uploadedCount === 1
          ? '1 screenshot uploaded.'
          : `${uploadedCount} screenshots uploaded.`,
      )
    }

    if (failures.length > 0) {
      setScreenshotError(failures.join(' '))
    }

    setIsUploadingScreenshots(false)
  }

  async function handleDeleteScreenshot(screenshot) {
    if (!screenshot?.id) {
      setScreenshotError('Screenshot id is missing.')
      return
    }

    const shouldDelete = window.confirm(
      'Delete this screenshot record? This removes it from the project, but the Storage file will not be deleted yet.',
    )

    if (!shouldDelete) {
      return
    }

    setDeletingScreenshotId(screenshot.id)
    setScreenshotError(null)
    setScreenshotSuccessMessage(null)

    const result = await deleteProjectScreenshot(screenshot.id)

    if (result.error) {
      setScreenshotError(result.error)
      setDeletingScreenshotId(null)
      return
    }

    await refreshScreenshots()
    setScreenshotSuccessMessage('Screenshot record deleted.')
    setDeletingScreenshotId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setValidationError(null)
    setThumbnailError(null)
    setSuccessMessage(null)

    if (!formData.title.trim()) {
      setValidationError('Project title is required.')
      return
    }

    const thumbnailValidationError = validateThumbnailFile(thumbnailFile)

    if (thumbnailValidationError) {
      setThumbnailError(thumbnailValidationError)
      return
    }

    setIsSaving(true)

    if (isEditMode) {
      if (thumbnailFile) {
        const thumbnailUploadResult = await uploadProjectThumbnail(thumbnailFile, id)

        if (thumbnailUploadResult.error) {
          setThumbnailError(thumbnailUploadResult.error)
          setIsSaving(false)
          return
        }

        const result = await updateProject(id, {
          ...formData,
          thumbnail_url: thumbnailUploadResult.publicUrl,
        })

        if (result.error) {
          await deleteStorageFile(THUMBNAIL_BUCKET, thumbnailUploadResult.path)
          setError(result.error)
          setIsSaving(false)
          return
        }

        setFormData((currentData) => ({
          ...currentData,
          thumbnail_url: thumbnailUploadResult.publicUrl ?? '',
        }))

        setSuccessMessage('Project updated. Returning to dashboard...')
        window.setTimeout(() => {
          navigate('/admin/dashboard')
        }, 700)
        return
      }

      const result = await updateProject(id, formData)

      if (result.error) {
        setError(result.error)
        setIsSaving(false)
        return
      }

      setSuccessMessage('Project updated. Returning to dashboard...')
      window.setTimeout(() => {
        navigate('/admin/dashboard')
      }, 700)
      return
    }

    const result = await createProject(formData)

    if (result.error) {
      setError(result.error)
      setIsSaving(false)
      return
    }

    if (thumbnailFile && result.project?.id) {
      const thumbnailUploadResult = await uploadProjectThumbnail(thumbnailFile, result.project.id)

      if (thumbnailUploadResult.error) {
        setThumbnailError(`Project was created, but thumbnail upload failed: ${thumbnailUploadResult.error}`)
        setIsSaving(false)
        return
      }

      const thumbnailUpdateResult = await updateProject(result.project.id, {
        ...formData,
        thumbnail_url: thumbnailUploadResult.publicUrl,
      })

      if (thumbnailUpdateResult.error) {
        await deleteStorageFile(THUMBNAIL_BUCKET, thumbnailUploadResult.path)
        setError(`Project was created, but thumbnail URL could not be saved: ${thumbnailUpdateResult.error}`)
        setIsSaving(false)
        return
      }

      setFormData((currentData) => ({
        ...currentData,
        thumbnail_url: thumbnailUploadResult.publicUrl ?? '',
      }))
    }

    setSuccessMessage('Project created. Returning to dashboard...')

    window.setTimeout(() => {
      navigate('/admin/dashboard')
    }, 700)
  }

  if (isLoadingProject) {
    return (
      <AdminLayout
        title="Edit Project"
        description="Loading the selected CMS project."
      >
        <LoadingState label="Loading project..." />
      </AdminLayout>
    )
  }

  if (loadError) {
    return (
      <AdminLayout
        title="Edit Project"
        description="The selected project could not be loaded."
      >
        <ErrorState
          title="Project unavailable"
          message={loadError}
          action={
            <Link
              className="inline-flex border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-100"
              to="/admin/dashboard"
            >
              Back to Dashboard
            </Link>
          }
        />
      </AdminLayout>
    )
  }

  if (notFound) {
    return (
      <AdminLayout
        title="Edit Project"
        description="The selected project does not exist."
      >
        <EmptyState
          title="Project not found"
          description="This CMS project could not be found in Supabase."
          action={
            <Link
              className="inline-flex border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-100"
              to="/admin/dashboard"
            >
              Back to Dashboard
            </Link>
          }
        />
      </AdminLayout>
    )
  }

  const thumbnailSource = thumbnailPreviewUrl || formData.thumbnail_url
  const hasThumbnailSource = Boolean(thumbnailSource)
  const isThumbnailPlaceholder = thumbnailSource === '#'

  return (
    <AdminLayout
      title={isEditMode ? 'Edit Project' : 'New Project'}
      description={
        isEditMode
          ? 'Update an existing Supabase CMS project. Only the title is required.'
          : 'Create a real Supabase CMS project. Only the title is required.'
      }
    >
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        {successMessage ? (
          <div className="border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            {successMessage}
          </div>
        ) : null}

        {validationError ? (
          <div className="border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100" role="alert">
            {validationError}
          </div>
        ) : null}

        {error ? (
          <div className="border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
            {error}
          </div>
        ) : null}

        {isSaving ? (
          <div className="border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            Saving project changes...
          </div>
        ) : null}

        <FieldGroup
          title="Basic Info"
          description="Core project identity for CMS and public routing."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <TextInput
              id="title"
              label="Title"
              onChange={handleChange}
              placeholder="Backend API Prototype"
              required
              value={formData.title}
            />
            <TextInput
              id="slug"
              label="Slug"
              onChange={handleChange}
              placeholder="backend-api-prototype"
              helperText="Optional. Leave empty to generate a URL-friendly slug from the title."
              value={formData.slug}
            />
          </div>
          <TextArea
            id="short_description"
            label="Short Description"
            onChange={handleChange}
            placeholder="Brief public summary for project cards."
            rows={3}
            value={formData.short_description}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TextInput
              id="category"
              label="Category"
              onChange={handleChange}
              placeholder="Backend"
              value={formData.category}
            />
            <TextInput
              id="year"
              label="Year"
              onChange={handleChange}
              placeholder="2026"
              type="number"
              value={formData.year}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <label className="grid gap-2" htmlFor="thumbnail_file">
              <span className="text-sm font-medium text-slate-300">Thumbnail</span>
              <input
                accept="image/*"
                className="border border-slate-800 bg-[#05070b] px-4 py-3 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.18em] file:text-slate-100 hover:file:bg-slate-700"
                id="thumbnail_file"
                name="thumbnail_file"
                onChange={handleThumbnailChange}
                type="file"
              />
              <span className="text-xs leading-5 text-slate-500">
                Optional. Upload a thumbnail image up to 5 MB.
              </span>
              {thumbnailError ? (
                <span className="text-xs leading-5 text-rose-300" role="alert">
                  {thumbnailError}
                </span>
              ) : thumbnailFile ? (
                <span className="text-xs leading-5 text-cyan-200">Selected file: {thumbnailFile.name}</span>
              ) : formData.thumbnail_url ? (
                <span className="text-xs leading-5 text-slate-400">
                  Current thumbnail is already saved. Select a new file to replace it.
                </span>
              ) : null}
            </label>

            <div className="overflow-hidden border border-slate-800 bg-[#05070b]">
              {hasThumbnailSource ? (
                isThumbnailPlaceholder ? (
                  <div className="flex min-h-44 items-center justify-center px-6 text-center">
                    <div className="grid gap-2">
                      <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
                        Thumbnail Placeholder
                      </span>
                      <span className="text-sm text-slate-400">
                        This project currently uses a placeholder thumbnail.
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    alt="Project thumbnail preview"
                    className="min-h-44 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.hidden = true
                    }}
                    src={thumbnailSource}
                  />
                )
              ) : (
                <div className="flex min-h-44 items-center justify-center px-6 text-center">
                  <div className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-500">No Thumbnail Yet</span>
                    <span className="text-sm text-slate-400">
                      The project will still work with a clean placeholder if no thumbnail is added.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Project Story"
          description="Optional case-study content for the public project detail page."
        >
          <TextArea
            id="overview"
            label="Overview"
            onChange={handleChange}
            placeholder="What this project is about."
            rows={7}
            value={formData.overview}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <TextArea
              id="problem"
              label="Problem"
              onChange={handleChange}
              placeholder="Problem or context."
              rows={7}
              value={formData.problem}
            />
            <TextArea
              id="solution"
              label="Solution"
              onChange={handleChange}
              placeholder="How the project addresses it."
              rows={7}
              value={formData.solution}
            />
            <TextArea
              id="result"
              label="Result"
              onChange={handleChange}
              placeholder="Outcome or current state."
              rows={7}
              value={formData.result}
            />
          </div>
          <TextArea
            id="what_i_learned"
            label="What I Learned"
            onChange={handleChange}
            placeholder="Technical lessons or reflection."
            rows={7}
            value={formData.what_i_learned}
          />
        </FieldGroup>

        <FieldGroup
          title="Technical Details"
          description="Use comma-separated values for features and tech stack."
        >
          <TextArea
            id="features"
            label="Features"
            onChange={handleChange}
            placeholder="Authentication flow, API routing, deployment notes"
            helperText="Optional. Separate multiple features with commas."
            rows={3}
            value={formData.features}
          />
          <TextArea
            id="tech_stack"
            label="Tech Stack"
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL, Supabase"
            helperText="Optional. Separate technologies with commas."
            rows={3}
            value={formData.tech_stack}
          />
        </FieldGroup>

        <FieldGroup
          title="Links"
          description="Optional public links. Leave unavailable links empty."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <TextInput
              id="github_url"
              label="GitHub URL"
              onChange={handleChange}
              placeholder="https://github.com/..."
              helperText="Optional. Leave empty for projects without source code."
              value={formData.github_url}
            />
            <TextInput
              id="demo_video_url"
              label="Demo Video URL"
              onChange={handleChange}
              placeholder="https://..."
              helperText="Optional. Use only when a demo video exists."
              value={formData.demo_video_url}
            />
            <TextInput
              id="documentation_url"
              label="Documentation URL"
              onChange={handleChange}
              placeholder="https://..."
              helperText="Optional. Useful for academic, cloud, documentation, or case-study projects."
              value={formData.documentation_url}
            />
          </div>
        </FieldGroup>

        <FieldGroup
          title="Display Options"
          description="Controls how the project appears in the public portfolio."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="flex items-center gap-3 border border-slate-800 bg-[#05070b] px-4 py-3">
              <input
                checked={formData.is_featured}
                className="h-4 w-4 accent-cyan-300"
                name="is_featured"
                onChange={handleChange}
                type="checkbox"
              />
              <span className="text-sm font-medium text-slate-300">Featured project</span>
            </label>
            <TextInput
              id="display_order"
              label="Display Order"
              onChange={handleChange}
              placeholder="1"
              type="number"
              value={formData.display_order}
            />
          </div>
        </FieldGroup>

        <FieldGroup
          title="Screenshots"
          description="Optional project detail images. Screenshots can be added after a project exists in Supabase."
        >
          {!isEditMode ? (
            <div className="border border-slate-800 bg-[#05070b] p-5 text-sm leading-6 text-slate-400">
              Save the project first, then edit it to add screenshots.
            </div>
          ) : (
            <>
              <div className="grid gap-4 border border-slate-800 bg-[#05070b] p-5">
                <label className="grid gap-2" htmlFor="screenshot_files">
                  <span className="text-sm font-medium text-slate-300">Upload Screenshots</span>
                  <input
                    accept="image/*"
                    className="border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.18em] file:text-slate-100 hover:file:bg-slate-700"
                    id="screenshot_files"
                    multiple
                    name="screenshot_files"
                    onChange={handleScreenshotFilesChange}
                    ref={screenshotInputRef}
                    type="file"
                  />
                  <span className="text-xs leading-5 text-slate-500">
                    Optional. Select one or more image files up to 5 MB each.
                  </span>
                </label>

                {screenshotFiles.length > 0 ? (
                  <div className="border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      {screenshotFiles.length === 1 ? '1 file selected' : `${screenshotFiles.length} files selected`}
                    </p>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                      {screenshotFiles.map((file) => (
                        <li key={`${file.name}-${file.size}-${file.lastModified}`} className="truncate">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {screenshotSuccessMessage ? (
                  <div className="border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    {screenshotSuccessMessage}
                  </div>
                ) : null}

                {screenshotError ? (
                  <div className="border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
                    {screenshotError}
                  </div>
                ) : null}

                <div>
                  <button
                    className="inline-flex justify-center border border-cyan-400/50 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isUploadingScreenshots || screenshotFiles.length === 0}
                    onClick={handleUploadScreenshots}
                    type="button"
                  >
                    {isUploadingScreenshots ? 'Uploading...' : 'Upload Screenshots'}
                  </button>
                </div>
              </div>

              {isLoadingScreenshots ? (
                <LoadingState label="Loading screenshots..." />
              ) : screenshots.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {screenshots.map((screenshot) => {
                    const imageUrl = getScreenshotImageUrl(screenshot)

                    return (
                      <article key={screenshot.id} className="overflow-hidden border border-slate-800 bg-[#05070b]">
                        {imageUrl ? (
                          <img
                            alt={screenshot.caption || 'Project screenshot'}
                            className="aspect-video w-full object-cover"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.hidden = true
                            }}
                            src={imageUrl}
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-slate-500">
                            Screenshot URL unavailable
                          </div>
                        )}

                        <div className="grid gap-4 p-4">
                          {screenshot.caption ? (
                            <p className="text-sm leading-6 text-slate-300">{screenshot.caption}</p>
                          ) : null}
                          <button
                            className="inline-flex justify-center border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={deletingScreenshotId === screenshot.id}
                            onClick={() => handleDeleteScreenshot(screenshot)}
                            type="button"
                          >
                            {deletingScreenshotId === screenshot.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="border border-slate-800 bg-[#05070b] p-5 text-sm leading-6 text-slate-400">
                  No screenshots have been added to this project yet.
                </div>
              )}
            </>
          )}
        </FieldGroup>

        <div className="flex flex-col gap-3 border border-slate-800 bg-slate-950/70 p-5 sm:flex-row sm:items-center sm:justify-end">
          <Link
            className="inline-flex justify-center border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            to="/admin/dashboard"
            aria-disabled={isSaving}
          >
            Cancel
          </Link>
          <button
            className="inline-flex justify-center border border-cyan-400/50 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Saving...' : isEditMode ? 'Update Project' : 'Save Project'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
