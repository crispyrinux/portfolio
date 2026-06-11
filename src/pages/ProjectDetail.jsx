import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PublicLayout from '../components/layout/PublicLayout'
import { normalizeArray } from '../lib/utils'
import { getProjectBySlug, getProjectScreenshots } from '../services/projectService'

const detailBlocks = [
  { key: 'overview', label: 'Overview' },
  { key: 'problem', label: 'Problem' },
  { key: 'solution', label: 'Solution' },
  { key: 'result', label: 'Result' },
]

const linkBlocks = [
  { key: 'github_url', label: 'GitHub' },
  { key: 'demo_video_url', label: 'Demo' },
  { key: 'documentation_url', label: 'Documentation' },
]

function MediaFallback({ label, title }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,140,255,0.2),transparent_50%),linear-gradient(135deg,rgba(148,163,184,0.08),rgba(5,7,11,0.96))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden="true"
      />
      <div className="relative grid gap-3 text-center">
        <span className="text-[10px] uppercase tracking-[0.35em] text-muted">{label}</span>
        {title ? <span className="text-sm font-medium text-foreground">{title}</span> : null}
      </div>
    </div>
  )
}

function ProjectThumbnail({ thumbnailUrl, title }) {
  const [hasImageError, setHasImageError] = useState(false)

  if (!thumbnailUrl) {
    return null
  }

  const shouldShowImage = thumbnailUrl !== '#' && !hasImageError

  return (
    <div className="overflow-hidden border border-line bg-ink shadow-panel">
      <div className="relative aspect-[16/9] overflow-hidden bg-panelStrong">
        <MediaFallback
          label={hasImageError ? 'Thumbnail unavailable' : 'Thumbnail placeholder'}
          title={title}
        />
        {shouldShowImage ? (
          <img
            alt={`${title} project thumbnail`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => {
              setHasImageError(true)
            }}
            src={thumbnailUrl}
          />
        ) : null}
      </div>
    </div>
  )
}

function DetailCard({ label, children }) {
  return (
    <article className="border border-line bg-panel/75 p-6 shadow-panel">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <div className="mt-4 text-sm leading-7 text-muted">{children}</div>
    </article>
  )
}

function ExternalLinkButton({ href, label }) {
  const isPlaceholder = href === '#'

  return (
    <a
      className="inline-flex items-center justify-center border border-line px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
      href={href}
      onClick={(event) => {
        if (isPlaceholder) {
          event.preventDefault()
        }
      }}
    >
      <span>{label}</span>
      {isPlaceholder ? <span className="ml-2 text-[10px] uppercase tracking-[0.25em] text-muted">Placeholder</span> : null}
    </a>
  )
}

function NotFoundState() {
  return (
    <div className="flex min-h-[64vh] items-center justify-center">
      <EmptyState
        title="Project not found"
        description="The project you requested is not available in the local fallback data set."
        action={
          <Link
            className="inline-flex border border-accent/60 bg-accent-soft px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-panelStrong"
            to="/#projects"
          >
            Return to projects
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
            className="inline-flex border border-accent/60 bg-accent-soft px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-panelStrong"
            to="/#projects"
          >
            Return to projects
          </Link>
        }
        className="w-full max-w-xl"
      />
    </div>
  )
}

function getScreenshotImageUrl(screenshot) {
  return screenshot?.image_url || screenshot?.url || ''
}

function ScreenshotFigure({ projectTitle, screenshot, index }) {
  const [hasImageError, setHasImageError] = useState(false)
  const imageUrl = getScreenshotImageUrl(screenshot)
  const altText = screenshot.alt || `${projectTitle} screenshot ${index + 1}`
  const shouldShowImage = Boolean(imageUrl && !hasImageError)

  return (
    <figure className="overflow-hidden border border-line bg-ink">
      <div className="relative aspect-video bg-ink">
        <MediaFallback
          label={hasImageError ? 'Screenshot unavailable' : 'Screenshot preview'}
          title={`${projectTitle} ${index + 1}`}
        />
        {shouldShowImage ? (
          <img
            alt={altText}
            className="absolute inset-0 h-full w-full bg-ink object-cover"
            loading="lazy"
            onError={() => {
              setHasImageError(true)
            }}
            src={imageUrl}
          />
        ) : null}
      </div>
      {screenshot.caption ? (
        <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-muted">
          {screenshot.caption}
        </figcaption>
      ) : null}
    </figure>
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
  const detailEntries = detailBlocks.filter((block) => Boolean(project[block.key]))
  const linkEntries = linkBlocks.filter((block) => Boolean(project[block.key]))
  const displayableScreenshots = screenshots.filter((screenshot) => getScreenshotImageUrl(screenshot))
  const hasSnapshotContent = Boolean(project.category || project.year || techStack.length > 0)
  const hasDetailContent = Boolean(
    project.short_description ||
      detailEntries.length > 0 ||
      features.length > 0 ||
      techStack.length > 0 ||
      project.what_i_learned ||
      linkEntries.length > 0 ||
      displayableScreenshots.length > 0 ||
      isLoadingScreenshots,
  )

  return (
    <PublicLayout>
      <article className="space-y-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-muted">Project Detail</p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{project.title}</h1>
              {project.short_description ? (
                <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
                  {project.short_description}
                </p>
              ) : null}
            </div>

            {project.thumbnail_url ? <ProjectThumbnail thumbnailUrl={project.thumbnail_url} title={project.title} /> : null}

            {(project.category || project.year) ? (
              <div className="flex flex-wrap gap-2">
                {project.category ? (
                  <span className="border border-line bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {project.category}
                  </span>
                ) : null}
                {project.year ? (
                  <span className="border border-line bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {project.year}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            {hasSnapshotContent ? (
              <div className="border border-line bg-panel/75 p-6 shadow-panel">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Project Snapshot</p>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  {project.category ? (
                    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                      <span>Category</span>
                      <span className="text-foreground">{project.category}</span>
                    </div>
                  ) : null}
                  {project.year ? (
                    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                      <span>Year</span>
                      <span className="text-foreground">{project.year}</span>
                    </div>
                  ) : null}
                  {techStack.length > 0 ? (
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((item) => (
                          <span
                            key={item}
                            className="border border-line bg-ink/70 px-2.5 py-1 text-xs text-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {linkEntries.length > 0 ? (
              <div className="border border-line bg-panel/75 p-6 shadow-panel">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Links</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {linkEntries.map((link) => (
                    <ExternalLinkButton key={link.key} href={project[link.key]} label={link.label} />
                  ))}
                </div>
              </div>
            ) : null}

            {!hasSnapshotContent && !linkEntries.length ? (
              <div className="border border-line bg-panel/75 p-6 shadow-panel">
                <p className="text-sm leading-7 text-muted">
                  This project currently has only a title. More details can be added later.
                </p>
              </div>
            ) : null}
          </aside>
        </section>

        {detailEntries.length > 0 ? (
          <section className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Case Study</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Project narrative
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {detailEntries.map((entry) => (
                <DetailCard key={entry.key} label={entry.label}>
                  {project[entry.key]}
                </DetailCard>
              ))}
            </div>
          </section>
        ) : null}

        {features.length > 0 ? (
          <section className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Features</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span key={feature} className="border border-line bg-ink/70 px-3 py-2 text-sm text-muted">
                  {feature}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {project.what_i_learned ? (
          <section className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">What I Learned</p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">{project.what_i_learned}</p>
          </section>
        ) : null}

        {isLoadingScreenshots ? (
          <div className="border border-line bg-panel/60 p-5 text-sm text-muted shadow-panel">
            Loading project screenshots...
          </div>
        ) : null}

        {displayableScreenshots.length > 0 ? (
          <section className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Screenshots</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {displayableScreenshots.map((screenshot, index) => (
                <ScreenshotFigure
                  key={screenshot.id || getScreenshotImageUrl(screenshot) || index}
                  projectTitle={project.title}
                  screenshot={screenshot}
                  index={index}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!hasDetailContent ? (
          <section className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
            <p className="text-sm leading-7 text-muted">
              This project is intentionally sparse and only includes a title for now.
            </p>
          </section>
        ) : null}
      </article>
    </PublicLayout>
  )
}
