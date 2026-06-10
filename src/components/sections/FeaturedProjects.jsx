import ProjectCard from '../projects/ProjectCard'
import SectionHeader from '../ui/SectionHeader'
import { fallbackProjects } from '../../data/fallbackProjects'

const featuredProjects = [...fallbackProjects]
  .filter((project) => project.is_featured === true && project.is_archived !== true)
  .sort((a, b) => {
    const firstOrder = a.display_order ?? Number.MAX_SAFE_INTEGER
    const secondOrder = b.display_order ?? Number.MAX_SAFE_INTEGER

    return firstOrder - secondOrder
  })

export default function FeaturedProjects() {
  return (
    <section id="featured-projects" className="scroll-mt-24 py-14 sm:py-16" aria-labelledby="featured-projects-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Featured Projects"
          titleId="featured-projects-title"
          title="Featured fallback projects"
          description="Highlighted local fallback projects for the public portfolio preview."
        />

        <a
          className="inline-flex w-fit items-center justify-center border border-line px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
          href="#projects"
        >
          View Project Lab
        </a>
      </div>

      {featuredProjects.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id || project.slug || project.title} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-line bg-panel/75 p-6 text-sm leading-7 text-muted shadow-panel">
          Featured projects will appear here when fallback project entries are marked as featured.
        </div>
      )}
    </section>
  )
}
