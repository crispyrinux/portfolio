import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../../services/projectService'
import { getProjectSlug, normalizeArray } from '../../lib/utils'
import SpotlightCard from '../ui/SpotlightCard'

function StatusBadge({ isArchived }) {
  if (isArchived) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
        <span className="h-1 w-1 rounded-full bg-muted/30" />
        Archived
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400/80">
      <span className="h-1 w-1 rounded-full bg-emerald-400" />
      Live
    </span>
  )
}

function SandboxCard({ project, isLive }) {
  const slug = getProjectSlug(project)
  const techStack = normalizeArray(project.tech_stack)

  if (isLive) {
    return (
      <motion.div variants={fadeUp} className="h-full">
        <SpotlightCard
          className="flex h-full flex-col justify-between p-5"
          containerClassName="h-full"
        >
          <div>
            {/* Top row: status + github */}
            <div className="mb-4 flex items-center justify-between">
              <StatusBadge isArchived={false} />
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
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
              <p className="mb-4 text-xs leading-5 text-muted">{project.short_description}</p>
            )}
          </div>

          <div>
            {/* Tech tags */}
            {techStack.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5 pt-3 border-t border-line/40">
                {techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="border border-line bg-ink/20 px-2 py-0.5 font-mono text-[9px] text-muted/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* View detail link */}
            <Link
              to={`/projects/${slug}`}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/70 transition-colors hover:text-accent"
              aria-label={`View details for ${project.title}`}
            >
              View Details →
            </Link>
          </div>
        </SpotlightCard>
      </motion.div>
    )
  }

  // Archived Flat Card
  return (
    <motion.article
      className="group flex flex-col justify-between border border-line/60 bg-panel/20 p-5 rounded-lg transition-colors duration-200 hover:border-line/80 hover:bg-panel/40"
      variants={fadeUp}
    >
      <div>
        {/* Top row: status + github */}
        <div className="mb-3 flex items-center justify-between">
          <StatusBadge isArchived={true} />
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40 transition-colors hover:text-foreground/80"
              aria-label={`GitHub repository for ${project.title}`}
            >
              Repo →
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xs font-semibold text-foreground/80">{project.title}</h3>

        {/* Description */}
        {project.short_description && (
          <p className="mb-4 text-[11px] leading-5 text-muted/70">{project.short_description}</p>
        )}
      </div>

      <div>
        {/* Tech tags */}
        {techStack.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="border border-line/40 bg-ink/10 px-1.5 py-0.5 font-mono text-[8px] text-muted/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* View detail link */}
        <Link
          to={`/projects/${slug}`}
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60 transition-colors hover:text-muted"
          aria-label={`View details for ${project.title}`}
        >
          View Details →
        </Link>
      </div>
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

  const liveProjects = projects.filter((p) => !p.is_archived)
  const archivedProjects = projects.filter((p) => p.is_archived)

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="sandbox-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
            SYS // EXPERIMENTAL_SANDBOX
          </p>
          <h2
            id="sandbox-title"
            className="text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl"
          >
            The Sandbox Lab
          </h2>
          <p className="mt-3 max-w-xl text-xs leading-6 text-muted">
            A collection of academic projects, backend experiments, and tool-building exercises. Proof of curiosity, not production artifacts.
          </p>
        </div>
        {!isLoading && !error && (
          <p className="shrink-0 font-mono text-[10px] text-muted/40">
            // {projects.length} files indexed
          </p>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center gap-3 py-10">
          <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
          <p className="font-mono text-xs text-muted">Loading sandbox indices…</p>
        </div>
      ) : error ? (
        <p className="font-mono text-xs text-muted">{error}</p>
      ) : projects.length === 0 ? (
        <p className="font-mono text-xs text-muted">No projects indexed yet.</p>
      ) : (
        <div className="space-y-12">
          {/* Live Projects Grid */}
          {liveProjects.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent/80">
                SYS // ACTIVE_REPOSITORIES
              </p>
              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
              >
                {liveProjects.map((project) => (
                  <SandboxCard
                    key={project.id || project.slug || project.title}
                    project={project}
                    isLive={true}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {/* Archived Projects Grid */}
          {archivedProjects.length > 0 && (
            <div className="space-y-4 pt-10 border-t border-line/30">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted/40">
                SYS // ARCHIVED_REPOSITORIES // READ_ONLY
              </p>
              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
              >
                {archivedProjects.map((project) => (
                  <SandboxCard
                    key={project.id || project.slug || project.title}
                    project={project}
                    isLive={false}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </motion.section>
  )
}

