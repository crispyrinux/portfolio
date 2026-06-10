import { Link } from 'react-router-dom'
import { cn, getProjectSlug, normalizeArray } from '../../lib/utils'

const linkItems = [
  { key: 'github_url', label: 'GitHub' },
  { key: 'demo_video_url', label: 'Demo' },
  { key: 'documentation_url', label: 'Documentation' },
]

function ThumbnailPlaceholder({ title }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center bg-ink">
      <div className="grid h-20 w-20 place-items-center border border-accent/40 bg-accent-soft text-xs uppercase tracking-[0.2em] text-muted">
        {title.slice(0, 2).toUpperCase()}
      </div>
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
      <div className="relative min-h-48 border-b border-line bg-ink">
        {project.thumbnail_url ? (
          <>
            <ThumbnailPlaceholder title={title} />
            <img
              alt={`${title} thumbnail`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
              src={project.thumbnail_url}
            />
          </>
        ) : (
          <ThumbnailPlaceholder title={title} />
        )}
      </div>

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
