import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn, getProjectSlug, normalizeArray } from '../../lib/utils'

const linkItems = [
  { key: 'github_url', label: 'GitHub' },
  { key: 'demo_video_url', label: 'Demo' },
  { key: 'documentation_url', label: 'Documentation' },
]

function ThumbnailPlaceholder({ title, message = 'Project media' }) {
  const initials = String(title || 'PX').slice(0, 2).toUpperCase()

  return (
    <div className="relative flex h-full min-h-48 items-center justify-center overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,140,255,0.2),transparent_45%),linear-gradient(135deg,rgba(148,163,184,0.08),rgba(5,7,11,0.96))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden="true"
      />
      <div className="relative grid place-items-center gap-3 text-center">
        <div className="grid h-20 w-20 place-items-center border border-accent/40 bg-accent-soft text-xs uppercase tracking-[0.2em] text-muted shadow-[0_0_40px_rgba(124,140,255,0.12)]">
          {initials}
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">{message}</span>
      </div>
    </div>
  )
}

const getOptimizedImageUrl = (url) => {
  if (!url) return url
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return url.replace('/object/public/', '/render/image/public/') + '?width=480&quality=80'
  }
  return url
}

function ProjectCardThumbnail({ title, thumbnailUrl }) {
  const [hasImageError, setHasImageError] = useState(false)
  const shouldShowImage = Boolean(thumbnailUrl && thumbnailUrl !== '#' && !hasImageError)

  return (
    <div className="relative min-h-48 border-b border-line bg-ink">
      <ThumbnailPlaceholder
        title={title}
        message={thumbnailUrl && hasImageError ? 'Media unavailable' : 'Backend lab'}
      />
      {shouldShowImage ? (
        <img
          alt={`${title} project thumbnail`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          onError={() => {
            setHasImageError(true)
          }}
          src={getOptimizedImageUrl(thumbnailUrl)}
        />
      ) : null}
    </div>
  )
}

export default function ProjectCard({ project }) {
  const title = project.title
  const slug = getProjectSlug(project)
  const techStack = normalizeArray(project.tech_stack)
  const projectLinks = linkItems.filter((item) => project[item.key])

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-line bg-panel/75 shadow-panel transition-colors hover:border-accent/60">
      <ProjectCardThumbnail title={title} thumbnailUrl={project.thumbnail_url} />

      <div className="flex flex-1 flex-col p-6">
        {(project.category || project.is_featured) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.category ? (
              <span className="border border-line bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
                {project.category}
              </span>
            ) : null}
            {project.is_featured ? (
              <span className="border border-accent/50 bg-accent-soft px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground">
                Featured
              </span>
            ) : null}
          </div>
        )}

        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>

        {project.short_description ? (
          <p className="mt-3 text-sm leading-6 text-muted">{project.short_description}</p>
        ) : null}

        {techStack.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="border border-line bg-ink/70 px-2.5 py-1 text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            'mt-auto flex flex-wrap gap-3 pt-6',
            projectLinks.length === 0 && 'items-center',
          )}
        >
          <Link
            className="inline-flex items-center justify-center border border-accent/60 bg-accent-soft px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-panelStrong"
            aria-label={`View details for ${title}`}
            to={`/projects/${slug}`}
          >
            View Details
          </Link>

          {projectLinks.map((item) => (
            <a
              key={item.key}
              className="inline-flex items-center justify-center border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
              href={project[item.key]}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
