import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { createProject, getAdminProjectById, updateProject } from '../services/projectService'

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
  }
}

export default function ProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [formData, setFormData] = useState(initialFormState)
  const [isLoadingProject, setIsLoadingProject] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEditMode) {
      setFormData(initialFormState)
      setIsLoadingProject(false)
      setLoadError(null)
      setNotFound(false)
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
      setIsLoadingProject(false)
    }

    loadProject()

    return () => {
      isMounted = false
    }
  }, [id, isEditMode])

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

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setValidationError(null)
    setSuccessMessage(null)

    if (!formData.title.trim()) {
      setValidationError('Project title is required.')
      return
    }

    setIsSaving(true)

    const result = isEditMode ? await updateProject(id, formData) : await createProject(formData)

    if (result.error) {
      setError(result.error)
      setIsSaving(false)
      return
    }

    setSuccessMessage(isEditMode ? 'Project updated. Returning to dashboard...' : 'Project created. Returning to dashboard...')

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
