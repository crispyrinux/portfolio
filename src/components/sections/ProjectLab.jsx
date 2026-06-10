import { useEffect, useState } from 'react'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'
import LoadingState from '../common/LoadingState'
import ProjectCard from '../projects/ProjectCard'
import SectionHeader from '../ui/SectionHeader'
import { getPublicProjects } from '../../services/projectService'

export default function ProjectLab() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      try {
        const publicProjects = await getPublicProjects()

        if (isMounted) {
          setProjects(Array.isArray(publicProjects) ? publicProjects : [])
          setError(null)
        }
      } catch {
        if (isMounted) {
          setProjects([])
          setError('Projects could not be loaded right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

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

      {isLoading ? (
        <LoadingState label="Loading public projects..." />
      ) : error ? (
        <ErrorState title="Projects unavailable" message={error} />
      ) : projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id || project.slug || project.title} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No public projects yet"
          description="Projects will appear here when public project data is available."
        />
      )}
    </section>
  )
}
