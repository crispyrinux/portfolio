import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProjectCard from '../projects/ProjectCard'
import EmptyState from '../common/EmptyState'
import LoadingState from '../common/LoadingState'
import SectionHeader from '../ui/SectionHeader'
import { fadeUp, staggerContainer } from '../../lib/animations'
import { getPublicProjects } from '../../services/projectService'

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadFeaturedProjects() {
      try {
        const publicProjects = await getPublicProjects()
        const nextFeaturedProjects = Array.isArray(publicProjects)
          ? publicProjects.filter((project) => project.is_featured === true && project.is_archived !== true)
          : []

        if (isMounted) {
          setFeaturedProjects(nextFeaturedProjects)
        }
      } catch {
        if (isMounted) {
          setFeaturedProjects([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadFeaturedProjects()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <motion.section
      id="featured-projects"
      className="scroll-mt-24 py-14 sm:py-16"
      aria-labelledby="featured-projects-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
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

      {isLoading ? (
        <LoadingState label="Loading featured projects..." className="mt-8" />
      ) : featuredProjects.length > 0 ? (
        <motion.div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" variants={staggerContainer}>
          {featuredProjects.map((project) => (
            <motion.div key={project.id || project.slug || project.title} variants={fadeUp}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title="No featured projects yet"
          description="Featured projects will appear here when fallback project entries are marked as featured."
          className="mt-8"
        />
      )}
    </motion.section>
  )
}
