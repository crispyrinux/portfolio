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
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted/40">
        <span className="h-1 w-1 rounded-full bg-muted/30" />
        Archived
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-emerald-400/70">
      <span className="h-1 w-1 rounded-full bg-emerald-400" />
      Active
    </span>
  )
}

function FeaturedProjectCard({ project }) {
  const slug = getProjectSlug(project)
  const techStack = normalizeArray(project.tech_stack)
  const thumbnailUrl = project.thumbnail_url

  return (
    <motion.div variants={fadeUp} className="col-span-full">
      <Link to={`/projects/${slug}`} className="block group">
        <SpotlightCard
          className="flex flex-col p-0"
          containerClassName="h-full"
          spotlightColor="rgba(124, 140, 255, 0.03)"
        >
          <div className="relative overflow-hidden rounded-t-[7px]">
            {/* Image area */}
            <div className="relative aspect-[21/9] bg-gradient-to-br from-panel via-ink to-panelStrong">
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <StatusBadge isArchived={false} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {project.title}
              </h3>
              {project.short_description && (
                <p className="max-w-lg text-sm leading-relaxed text-muted/60">
                  {project.short_description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line/40 px-2.5 py-0.5 text-[10px] text-muted/50"
                >
                  {tech}
                </span>
              ))}
              <span className="ml-1 text-[11px] text-accent/60 transition-colors group-hover:text-accent">
                View →
              </span>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  )
}

function ProjectCard({ project, isLive }) {
  const slug = getProjectSlug(project)
  const techStack = normalizeArray(project.tech_stack)

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link to={`/projects/${slug}`} className="block h-full group">
        <SpotlightCard
          className="flex h-full flex-col justify-between p-5 sm:p-6"
          containerClassName="h-full"
          spotlightColor={isLive ? 'rgba(124, 140, 255, 0.025)' : 'rgba(148, 163, 184, 0.015)'}
        >
          <div>
            {/* Top row */}
            <div className="mb-4 flex items-center justify-between">
              <StatusBadge isArchived={!isLive} />
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-muted/40 transition-colors hover:text-foreground/70"
                  aria-label={`GitHub repository for ${project.title}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub ↗
                </a>
              )}
            </div>

            {/* Title */}
            <h3 className={`mb-2 font-semibold tracking-tight ${isLive ? 'text-sm text-foreground' : 'text-sm text-foreground/70'}`}>
              {project.title}
            </h3>

            {/* Description */}
            {project.short_description && (
              <p className={`mb-4 text-xs leading-6 ${isLive ? 'text-muted/60' : 'text-muted/40'}`}>
                {project.short_description}
              </p>
            )}
          </div>

          <div>
            {/* Tech tags */}
            {techStack.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5 border-t border-line/20 pt-4">
                {techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line/30 px-2 py-0.5 text-[9px] text-muted/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* View link */}
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors ${isLive ? 'text-accent/50 group-hover:text-accent' : 'text-muted/30 group-hover:text-muted/60'}`}
            >
              View Details
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
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

  // Split: first live project gets featured treatment
  const featuredProject = liveProjects.length > 0 ? liveProjects[0] : null
  const remainingLive = liveProjects.slice(1)

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="sandbox-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Header */}
      <div className="mb-12 flex flex-col gap-3 sm:mb-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted/40">
          All Projects
        </p>
        <h2
          id="sandbox-title"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          The Sandbox Lab
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted/50">
          A collection of academic projects, backend experiments, and tool-building exercises. Proof of curiosity, not production artifacts.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center gap-3 py-10">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/60" />
          <p className="text-xs text-muted/50">Loading projects…</p>
        </div>
      ) : error ? (
        <p className="text-xs text-muted/50">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-xs text-muted/50">No projects indexed yet.</p>
      ) : (
        <motion.div
          className="space-y-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Featured Project — full width hero card */}
          {featuredProject && (
            <FeaturedProjectCard project={featuredProject} />
          )}

          {/* Remaining Live Projects — 2-column grid */}
          {remainingLive.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {remainingLive.map((project) => (
                <ProjectCard
                  key={project.id || project.slug || project.title}
                  project={project}
                  isLive={true}
                />
              ))}
            </div>
          )}

          {/* Archived Projects — compact row */}
          {archivedProjects.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-line/20">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted/30">
                Archived
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {archivedProjects.map((project) => (
                  <ProjectCard
                    key={project.id || project.slug || project.title}
                    project={project}
                    isLive={false}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}
