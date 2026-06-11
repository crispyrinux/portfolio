import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { getAdminProjects } from '../services/projectService'

function formatDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function StatusBadge({ tone = 'slate', children }) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100'
      : tone === 'amber'
        ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
        : 'border-slate-700 bg-slate-950/70 text-slate-400'

  return (
    <span className={`inline-flex border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  )
}

function OverviewCard({ label, value }) {
  return (
    <article className="border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </article>
  )
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      setIsLoading(true)
      setError(null)

      const result = await getAdminProjects()

      if (!isMounted) {
        return
      }

      setProjects(result.projects)
      setError(result.error)
      setIsLoading(false)
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

  const overview = useMemo(() => {
    const total = projects.length
    const archived = projects.filter((project) => project.is_archived === true).length
    const featured = projects.filter((project) => project.is_featured === true).length

    return {
      total,
      archived,
      featured,
      active: total - archived,
    }
  }, [projects])

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Read-only CMS overview for real Supabase project data."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">CMS Overview</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">Project Inventory</h3>
          </div>

          <Link
            className="inline-flex w-fit items-center justify-center border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-400/15"
            to="/admin/projects/new"
          >
            New Project
          </Link>
        </div>

        {isLoading ? (
          <LoadingState label="Loading CMS projects..." />
        ) : error ? (
          <ErrorState title="Admin projects unavailable" message={error} />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Project totals">
              <OverviewCard label="Total Projects" value={overview.total} />
              <OverviewCard label="Active Projects" value={overview.active} />
              <OverviewCard label="Archived Projects" value={overview.archived} />
              <OverviewCard label="Featured Projects" value={overview.featured} />
            </section>

            {projects.length === 0 ? (
              <EmptyState
                title="No CMS projects yet"
                description="Real Supabase projects will appear here after they are created in the CMS."
              />
            ) : (
              <section className="overflow-hidden border border-slate-800 bg-slate-950/70">
                <div className="border-b border-slate-800 p-5">
                  <p className="text-sm font-medium text-white">Projects</p>
                  <p className="mt-1 text-sm text-slate-500">Read-only list from the Supabase projects table.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                    <thead className="bg-slate-950">
                      <tr>
                        <th className="px-5 py-3 font-medium text-slate-400">Title</th>
                        <th className="px-5 py-3 font-medium text-slate-400">Details</th>
                        <th className="px-5 py-3 font-medium text-slate-400">Status</th>
                        <th className="px-5 py-3 font-medium text-slate-400">Created</th>
                        <th className="px-5 py-3 font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {projects.map((project) => {
                        const createdAt = formatDate(project.created_at)

                        return (
                          <tr key={project.id || project.slug || project.title}>
                            <td className="px-5 py-4 align-top">
                              <p className="font-medium text-white">{project.title}</p>
                            </td>
                            <td className="px-5 py-4 align-top">
                              <div className="flex flex-wrap gap-2">
                                {project.category ? <StatusBadge>{project.category}</StatusBadge> : null}
                                {project.year ? <StatusBadge>{project.year}</StatusBadge> : null}
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top">
                              <div className="flex flex-wrap gap-2">
                                <StatusBadge tone={project.is_featured ? 'cyan' : 'slate'}>
                                  {project.is_featured ? 'Featured' : 'Standard'}
                                </StatusBadge>
                                <StatusBadge tone={project.is_archived ? 'amber' : 'slate'}>
                                  {project.is_archived ? 'Archived' : 'Active'}
                                </StatusBadge>
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top text-slate-400">
                              {createdAt ? <span>{createdAt}</span> : null}
                            </td>
                            <td className="px-5 py-4 align-top">
                              <div className="flex flex-wrap gap-2">
                                {project.id ? (
                                  <Link
                                    className="inline-flex border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-100"
                                    to={`/admin/projects/${project.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                ) : null}
                                <button
                                  className="inline-flex cursor-not-allowed border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600"
                                  disabled
                                  type="button"
                                >
                                  Archive coming next
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
