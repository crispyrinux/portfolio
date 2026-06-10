import ProjectCard from '../projects/ProjectCard'
import SectionHeader from '../ui/SectionHeader'
import { fallbackProjects } from '../../data/fallbackProjects'

const visibleProjects = [...fallbackProjects]
  .filter((project) => project.is_archived !== true)
  .sort((a, b) => {
    const firstOrder = a.display_order ?? Number.MAX_SAFE_INTEGER
    const secondOrder = b.display_order ?? Number.MAX_SAFE_INTEGER

    return firstOrder - secondOrder
  })

export default function ProjectLab() {
  return (
    <section id="projects" className="scroll-mt-24 py-14 sm:py-16" aria-labelledby="project-lab-title">
      <div className="mb-8">
        <SectionHeader
          eyebrow="Project Lab"
          titleId="project-lab-title"
          title="Fallback project render lab"
          description="Temporary local project data is rendered here to test optional fields before the CMS data source is connected later."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id || project.slug || project.title} project={project} />
        ))}
      </div>
    </section>
  )
}
