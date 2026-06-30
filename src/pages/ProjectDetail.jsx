import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PublicLayout from '../components/layout/PublicLayout'
import { normalizeArray } from '../lib/utils'
import { getProjectBySlug, getProjectScreenshots } from '../services/projectService'
import { fadeUp } from '../lib/animations'

const linkBlocks = [
  { key: 'github_url', label: 'Source Code', icon: '↗' },
  { key: 'demo_video_url', label: 'Live Demo', icon: '▶' },
  { key: 'documentation_url', label: 'Documentation', icon: '◆' },
]

function MediaFallback({ label, title }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,168,130,0.12),transparent_60%),linear-gradient(135deg,rgba(196,168,130,0.03),rgba(15,15,18,0.98))]"
        aria-hidden="true"
      />
      <div className="relative grid gap-2 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted/30">{label}</span>
        {title ? <span className="text-sm font-medium text-foreground/50">{title}</span> : null}
      </div>
    </div>
  )
}

function getScreenshotImageUrl(screenshot) {
  return screenshot?.image_url || screenshot?.url || ''
}

function ScreenshotFigure({ projectTitle, screenshot, index, isHero = false }) {
  const [hasImageError, setHasImageError] = useState(false)
  const imageUrl = getScreenshotImageUrl(screenshot)
  const altText = screenshot.alt || `${projectTitle} screenshot ${index + 1}`
  const shouldShowImage = Boolean(imageUrl && !hasImageError)

  return (
    <motion.figure
      className={`group overflow-hidden rounded-xl bg-panelStrong/10 ${isHero ? 'col-span-full' : ''}`}
      variants={fadeUp}
    >
      <div className={`relative overflow-hidden ${isHero ? 'aspect-[16/8]' : 'aspect-video'}`}>
        <MediaFallback
          label={hasImageError ? 'Unavailable' : 'Preview'}
          title={`${projectTitle} ${index + 1}`}
        />
        {shouldShowImage ? (
          <img
            alt={altText}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            onError={() => {
              setHasImageError(true)
            }}
            src={imageUrl}
          />
        ) : null}
      </div>
      {screenshot.caption ? (
        <figcaption className="mt-3 text-xs leading-6 text-faint">
          {screenshot.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  )
}

function NotFoundState() {
  return (
    <div className="flex min-h-[64vh] items-center justify-center">
      <EmptyState
        title="Project not found"
        description="The project you requested is not available."
        action={
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-borderSubtle bg-panel px-5 py-2.5 text-sm font-medium text-foreground hover:bg-panelStrong hover:border-borderHover transition-all"
            to="/#featured-projects"
          >
            ← Back to Projects
          </Link>
        }
        className="w-full max-w-xl"
      />
    </div>
  )
}

function ProjectErrorState({ message }) {
  return (
    <div className="flex min-h-[64vh] items-center justify-center">
      <ErrorState
        title="Project unavailable"
        message={message}
        action={
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-borderSubtle bg-panel px-5 py-2.5 text-sm font-medium text-foreground hover:bg-panelStrong hover:border-borderHover transition-all"
            to="/#featured-projects"
          >
            ← Back to Projects
          </Link>
        }
        className="w-full max-w-xl"
      />
    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadProject() {
      setIsLoading(true)
      setError(null)
      setScreenshots([])
      setIsLoadingScreenshots(false)

      try {
        const nextProject = await getProjectBySlug(slug)

        if (!isMounted) {
          return
        }

        setProject(nextProject)
      } catch {
        if (isMounted) {
          setProject(null)
          setScreenshots([])
          setIsLoadingScreenshots(false)
          setError('Project details could not be loaded right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      isMounted = false
    }
  }, [slug])

  useEffect(() => {
    if (!project?.id) {
      setScreenshots([])
      setIsLoadingScreenshots(false)
      return undefined
    }

    let isMounted = true

    async function loadScreenshots() {
      setIsLoadingScreenshots(true)

      try {
        const nextScreenshots = await getProjectScreenshots(project.id)

        if (isMounted) {
          setScreenshots(Array.isArray(nextScreenshots) ? nextScreenshots : [])
        }
      } catch {
        if (isMounted) {
          setScreenshots([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingScreenshots(false)
        }
      }
    }

    loadScreenshots()

    return () => {
      isMounted = false
    }
  }, [project?.id])

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[64vh] items-center justify-center">
          <LoadingState label="Loading project details..." className="w-full max-w-2xl" />
        </div>
      </PublicLayout>
    )
  }

  if (error) {
    return (
      <PublicLayout>
        <ProjectErrorState message={error} />
      </PublicLayout>
    )
  }

  if (!project) {
    return (
      <PublicLayout>
        <NotFoundState />
      </PublicLayout>
    )
  }

  const features = normalizeArray(project.features)
  const techStack = normalizeArray(project.tech_stack)
  const linkEntries = linkBlocks.filter((block) => Boolean(project[block.key]))
  const displayableScreenshots = screenshots.filter((screenshot) => getScreenshotImageUrl(screenshot))
  const hasDetailContent = Boolean(
    project.short_description ||
      project.overview ||
      project.problem ||
      project.solution ||
      project.result ||
      features.length > 0 ||
      techStack.length > 0 ||
      project.what_i_learned ||
      linkEntries.length > 0 ||
      displayableScreenshots.length > 0 ||
      isLoadingScreenshots,
  )

  return (
    <PublicLayout>
      <article className="space-y-0">
        {/* ─── Hero Banner (Full-bleed, min-height 50vh, no badges) ─── */}
        <section className="relative left-1/2 w-screen -translate-x-1/2 mb-16">
          <div className="relative w-full min-h-[50vh] flex items-end bg-[radial-gradient(circle_at_20%_20%,rgba(0,85,255,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.04),transparent_50%),linear-gradient(135deg,#0a0e1b,#05070f)] overflow-hidden">
            {project.thumbnail_url && project.thumbnail_url !== '#' && (
              <img
                src={project.thumbnail_url}
                alt={`${project.title} hero`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
            )}
            {/* Gradient overlay scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/35 to-transparent" />

            {/* Back link */}
            <Link
              to="/#featured-projects"
              className="absolute top-8 left-8 z-10 inline-flex items-center gap-1.5 rounded-full border border-borderSubtle bg-ink/60 px-4 py-2 text-xs text-foreground/80 backdrop-blur-md transition-colors hover:border-borderHover hover:text-foreground"
            >
              ← Projects
            </Link>

            {/* Hero content */}
            <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pb-12 pt-32">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-foreground leading-tight max-w-4xl">
                {project.title}
              </h1>

              {project.short_description && (
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
                  {project.short_description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ─── Main Content Grid ─── */}
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          {/* Left Column: Stripe-blog style case study narrative */}
          <div className="space-y-16">
            {/* Overview: Large text, no section label, no borders, just prose */}
            {project.overview && (
              <motion.section 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-lg sm:text-xl leading-8 text-foreground/95 max-w-3xl font-light">
                  {project.overview}
                </p>
              </motion.section>
            )}

            {/* Interspersed Screenshot 1 (Full width poster visual) */}
            {displayableScreenshots.length > 0 && (
              <ScreenshotFigure
                projectTitle={project.title}
                screenshot={displayableScreenshots[0]}
                index={0}
                isHero={true}
              />
            )}

            {/* Architecture section (maps to problem) */}
            {project.problem && (
              <motion.section
                className="space-y-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Architecture
                </h2>
                <p className="text-base leading-7 text-muted">
                  {project.problem}
                </p>
              </motion.section>
            )}

            {/* Engineering Decisions section (maps to solution) */}
            {project.solution && (
              <motion.section
                className="space-y-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Engineering Decisions
                </h2>
                <p className="text-base leading-7 text-muted">
                  {project.solution}
                </p>
              </motion.section>
            )}

            {/* Implementation section (maps to features) */}
            {features.length > 0 && (
              <motion.section
                className="space-y-6 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Implementation
                </h2>
                <div className="space-y-4">
                  {features.map((feature, i) => (
                    <div key={feature} className="flex gap-4 items-start">
                      <span className="text-[11px] font-medium text-accent pt-1.5 select-none font-mono">
                        0{i + 1}
                      </span>
                      <span className="text-base text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Tradeoffs section (maps to result) */}
            {project.result && (
              <motion.section
                className="space-y-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tradeoffs
                </h2>
                <p className="text-base leading-7 text-muted">
                  {project.result}
                </p>
              </motion.section>
            )}

            {/* Lessons Learned */}
            {project.what_i_learned && (
              <motion.section
                className="space-y-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Lessons Learned
                </h2>
                <blockquote className="border-l-4 border-accent pl-6 py-1">
                  <p className="text-base leading-7 text-muted italic">
                    "{project.what_i_learned}"
                  </p>
                </blockquote>
              </motion.section>
            )}

            {/* Gallery (maps to remaining screenshots) */}
            {displayableScreenshots.length > 1 && (
              <motion.section
                className="space-y-6 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Gallery
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {displayableScreenshots.slice(1).map((screenshot, index) => (
                    <ScreenshotFigure
                      key={screenshot.id || getScreenshotImageUrl(screenshot) || index}
                      projectTitle={project.title}
                      screenshot={screenshot}
                      index={index + 1}
                      isHero={false}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Repository & Links */}
            {linkEntries.length > 0 && (
              <motion.section
                className="space-y-4 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Repository & Resources
                </h2>
                <div className="flex flex-col gap-3 pt-2">
                  {linkEntries.map((link) => {
                    const href = project[link.key]
                    const isPlaceholder = href === '#'
                    return (
                      <a
                        key={link.key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                        onClick={(event) => {
                          if (isPlaceholder) {
                            event.preventDefault()
                          }
                        }}
                      >
                        {link.label} <span className="font-light">→</span>
                      </a>
                    )
                  })}
                </div>
              </motion.section>
            )}

            {isLoadingScreenshots && (
              <div className="flex items-center gap-2 py-4">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/40" />
                <p className="text-xs text-muted/40">Loading screenshots...</p>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar, no borders, no cards, text-only label-value pairs */}
          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="space-y-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-faint">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-panelStrong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
            {(project.category || project.year) && (
              <div className="space-y-3.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-faint">Project Info</p>
                <div className="space-y-3 text-sm">
                  {project.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Category</span>
                      <span className="text-foreground font-medium">{project.category}</span>
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted">Year</span>
                      <span className="text-foreground font-medium">{project.year}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Empty state */}
        {!hasDetailContent && (
          <section className="py-16 text-center">
            <p className="text-sm text-muted/50">
              This project is intentionally sparse and only includes a title for now.
            </p>
          </section>
        )}
      </article>
    </PublicLayout>
  )
}
