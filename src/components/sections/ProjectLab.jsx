import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'
import LoadingState from '../common/LoadingState'
import ProjectCard from '../projects/ProjectCard'
import SectionHeader from '../ui/SectionHeader'
import { fadeUp, staggerContainer } from '../../lib/animations'
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
    <motion.section
      id="projects"
      className="scroll-mt-24 py-14 sm:py-16"
      aria-labelledby="project-lab-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
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
        <motion.div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" variants={staggerContainer}>
          {projects.map((project) => (
            <motion.div key={project.id || project.slug || project.title} variants={fadeUp}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title="No public projects yet"
          description="Projects will appear here when public project data is available."
        />
      )}
    </motion.section>
  )
}
