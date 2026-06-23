import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../../services/projectService'
import { getProjectSlug, normalizeArray } from '../../lib/utils'

function StatusBadge({ isArchived }) {
  if (isArchived) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
        Archived
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      Live
    </span>
  )
}

function SandboxCard({ project }) {
  const slug = getProjectSlug(project)
  const techStack = normalizeArray(project.tech_stack)

  return (
    <motion.article
      className="group flex flex-col border border-line bg-panel/40 p-5 transition-colors duration-200 hover:border-line/60 hover:bg-panel/70"
      variants={fadeUp}
    >
      {/* Top row: status + github */}
      <div className="mb-4 flex items-center justify-between">
        <StatusBadge isArchived={project.is_archived} />
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
            aria-label={`GitHub repository for ${project.title}`}
          >
            Repo →
          </a>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-sm font-semibold text-foreground">{project.title}</h3>

      {/* Description */}
      {project.short_description && (
        <p className="mb-4 flex-1 text-xs leading-5 text-muted">{project.short_description}</p>
      )}

      {/* Tech tags */}
      {techStack.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="border border-line bg-ink px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="font-mono text-[10px] text-muted/60">+{techStack.length - 4}</span>
          )}
        </div>
      )}

      {/* View detail link */}
      <Link
        to={`/projects/${slug}`}
        className="mt-auto font-mono text-[10px] uppercase tracking-[0.2em] text-accent/60 transition-colors hover:text-accent"
        aria-label={`View details for ${project.title}`}
      >
        View Details →
      </Link>
    </motion.article>
  )
}

export default function SandboxLab() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const all = await getPublicProjects()
        if (isMounted) {
          setProjects(Array.isArray(all) ? all : [])
          setError(null)
        }
      } catch {
        if (isMounted) {
          setProjects([])
          setError('Could not load projects.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="sandbox-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-muted">
            Experimental Work
          </p>
          <h2
            id="sandbox-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            The Sandbox Lab
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            A collection of academic projects, backend experiments, and tool-building exercises. Proof of curiosity, not production artifacts.
          </p>
        </div>
        {!isLoading && !error && (
          <p className="shrink-0 font-mono text-xs text-muted/50">
            {projects.length} project{projects.length !== 1 ? 's' : ''} indexed
          </p>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center gap-3 py-10">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <p className="font-mono text-sm text-muted">Loading projects…</p>
        </div>
      ) : error ? (
        <p className="font-mono text-sm text-muted">{error}</p>
      ) : projects.length === 0 ? (
        <p className="font-mono text-sm text-muted">No projects indexed yet.</p>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {projects.map((project) => (
            <SandboxCard key={project.id || project.slug || project.title} project={project} />
          ))}
        </motion.div>
      )}
    </motion.section>
  )
}
