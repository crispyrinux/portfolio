import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import PublicLayout from '../components/layout/PublicLayout'
import { fallbackProjects } from '../data/fallbackProjects'
import { getProjectSlug, normalizeArray, slugify } from '../lib/utils'

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

function ProjectThumbnail({ thumbnailUrl, title }) {
  if (!thumbnailUrl) {
    return null
  }

  const isPlaceholder = thumbnailUrl === '#'

  return (
    <div className="overflow-hidden border border-line bg-ink shadow-panel">
      <div className="relative aspect-[16/9] overflow-hidden bg-panelStrong">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,140,255,0.18),transparent_55%),linear-gradient(180deg,rgba(15,22,34,0.35),rgba(5,7,11,0.95))]"
          aria-hidden="true"
        />

        {isPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border border-accent/40 bg-ink/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-muted">
              Thumbnail Placeholder
            </div>
          </div>
        ) : (
          <img
            alt={`${title} thumbnail`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true
            }}
            src={thumbnailUrl}
          />
        )}
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

export default function ProjectDetail() {
  const { slug } = useParams()
  const routeSlug = slugify(slug)

  const project = fallbackProjects.find((item) => {
    if (item.is_archived === true) {
      return false
    }

    return slugify(getProjectSlug(item)) === routeSlug
  })

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
  const hasSnapshotContent = Boolean(project.category || project.year || techStack.length > 0)
  const hasDetailContent = Boolean(
    project.short_description ||
      detailEntries.length > 0 ||
      features.length > 0 ||
      techStack.length > 0 ||
      project.what_i_learned ||
      linkEntries.length > 0,
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
