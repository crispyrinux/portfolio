import { useEffect, useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { getArchivedProjects, restoreProject } from '../services/projectService'

function StatusBadge({ children }) {
  return (
    <span className="inline-flex border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-100">
      {children}
    </span>
  )
}

function DetailBadge({ children }) {
  return (
    <span className="inline-flex border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs font-medium text-slate-400">
      {children}
    </span>
  )
}

export default function Archive() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [restoringProjectId, setRestoringProjectId] = useState(null)

  async function loadArchivedProjects() {
    const result = await getArchivedProjects()
    setProjects(result.projects)
    setError(result.error)
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialProjects() {
      setIsLoading(true)

      const result = await getArchivedProjects()

      if (!isMounted) {
        return
      }

      setProjects(result.projects)
      setError(result.error)
      setIsLoading(false)
    }

    loadInitialProjects()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleRestoreProject(project) {
    if (!project?.id || restoringProjectId) {
      return
    }

    const confirmed = window.confirm(
      `Restore "${project.title}"? It will become visible again if public project data is enabled.`,
    )

    if (!confirmed) {
      return
    }

    setActionError(null)
    setSuccessMessage(null)
    setRestoringProjectId(project.id)

    const result = await restoreProject(project.id)

    if (result.error) {
      setActionError(result.error)
      setRestoringProjectId(null)
      return
    }

    await loadArchivedProjects()
    setSuccessMessage(`Restored "${project.title}".`)
    setRestoringProjectId(null)
  }

  return (
    <AdminLayout
      title="Archive"
      description="Restore archived CMS projects without permanently deleting them."
    >
      <div className="space-y-6">
        {successMessage ? (
          <div className="border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            {successMessage}
          </div>
        ) : null}

        {actionError ? (
          <div className="border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
            {actionError}
          </div>
        ) : null}

        {isLoading ? (
          <LoadingState label="Loading archived projects..." />
        ) : error ? (
          <ErrorState title="Archived projects unavailable" message={error} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No archived projects"
            description="Archived projects will appear here after they are hidden from the public portfolio."
          />
        ) : (
          <section className="overflow-hidden border border-slate-800 bg-slate-950/70">
            <div className="border-b border-slate-800 p-5">
              <p className="text-sm font-medium text-white">Archived Projects</p>
              <p className="mt-1 text-sm text-slate-500">Restore projects when they should appear publicly again.</p>
            </div>

            <div className="divide-y divide-slate-800">
              {projects.map((project) => (
                <article
                  className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center"
                  key={project.id || project.slug || project.title}
                >
                  <div className="space-y-3">
                    <p className="font-medium text-white">{project.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.category ? <DetailBadge>{project.category}</DetailBadge> : null}
                      {project.year ? <DetailBadge>{project.year}</DetailBadge> : null}
                      <StatusBadge>Archived</StatusBadge>
                    </div>
                  </div>

                  <button
                    className="inline-flex w-fit justify-center border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={restoringProjectId === project.id}
                    onClick={() => handleRestoreProject(project)}
                    type="button"
                  >
                    {restoringProjectId === project.id ? 'Restoring...' : 'Restore'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  )
}
