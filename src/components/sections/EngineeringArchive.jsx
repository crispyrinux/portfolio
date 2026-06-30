import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../../services/projectService'

const archiveFallbacks = [
  {
    slug: 'academic-prototype-system',
    title: 'Academic Prototype System',
    short_description: 'A prototype sample for testing cloud architectural plans and database configurations.',
    tags: ['System Design', 'Security', 'Auth0'],
  },
  {
    slug: 'distributed-log-pipeline',
    title: 'Distributed Log Aggregator',
    short_description: 'A highly concurrent TCP stream processor featuring sliding window buffers and event parsing.',
    tags: ['Go', 'Redis', 'Docker', 'gRPC'],
  },
  {
    slug: 'ast-query-optimizer',
    title: 'SQL Query Optimizer Engine',
    short_description: 'An abstract syntax tree analyzer isolating slow-join coordinates and proposing query index blueprints.',
    tags: ['Rust', 'PostgreSQL', 'Parser'],
  }
]

function ArchiveCardVisual({ title, thumbnailUrl, index, primaryTech }) {
  if (thumbnailUrl && thumbnailUrl !== '#') {
    return (
      <img
        src={thumbnailUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />
    )
  }

  // Soft, calm gradients that harmonize with the new palette (Electric Blue, Cyan, Purple)
  const gradients = [
    "bg-[radial-gradient(circle_at_30%_30%,rgba(0,85,255,0.04),transparent_50%),linear-gradient(135deg,#0a0e1b,#05070f_70%)]",
    "bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.03),transparent_40%),linear-gradient(120deg,#111627,#05070f_80%)]",
    "bg-[radial-gradient(circle_at_50%_60%,rgba(139,92,246,0.04),transparent_50%),linear-gradient(145deg,#0a0e1b,#05070f_60%)]"
  ]

  const bgGradient = gradients[index % gradients.length]
  const watermarkText = (primaryTech || 'CODE').toUpperCase()

  const watermarkColors = [
    "text-accent/[0.025]",
    "text-accent-cyan/[0.025]",
    "text-accent-purple/[0.025]"
  ]
  const watermarkColor = watermarkColors[index % watermarkColors.length]

  return (
    <div className={`absolute inset-0 ${bgGradient} overflow-hidden`}>
      <span className={`absolute -bottom-8 -right-4 text-[72px] font-bold leading-none tracking-[-0.08em] ${watermarkColor} select-none pointer-events-none uppercase`}>
        {watermarkText}
      </span>
      <span className="absolute left-6 top-5 text-[10px] font-medium tracking-[0.08em] uppercase text-faint select-none">
        ARCHIVE_0{index + 1}
      </span>
    </div>
  )
}

export default function EngineeringArchive() {
  const [archiveProjects, setArchiveProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const all = await getPublicProjects()
        const nonFeatured = Array.isArray(all)
          ? all.filter((p) => p.is_featured !== true && p.is_archived !== true)
          : []
        if (isMounted) setArchiveProjects(nonFeatured)
      } catch {
        if (isMounted) setArchiveProjects([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const projects = archiveProjects.length > 0
    ? archiveProjects.map((p) => ({
        slug: p.slug || p.id,
        title: p.title,
        thumbnail_url: p.thumbnail_url || null,
        description: p.short_description || 'A server-side technical prototype.',
        tags: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      }))
    : archiveFallbacks

  // Curated height ratios based on index to create a masonry-like editorial rhythm
  const getAspectClass = (index) => {
    const aspects = ['aspect-[4/3]', 'aspect-[16/10]', 'aspect-[16/9]']
    return aspects[index % aspects.length]
  }

  return (
    <motion.section
      id="archive"
      className="scroll-mt-24 py-32 sm:py-40"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="mb-20 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/80 block mb-3 animate-pulse">
          COLLECTION
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
          Engineering Archive
        </h2>
        <p className="mt-4 text-base leading-7 text-muted max-w-xl">
          A secondary laboratory index of utilities, microservices, and client-server study blueprints.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        {projects.map((project, index) => {
          const primaryTech = project.tags && project.tags[0] ? project.tags[0] : 'Backend'
          const aspectClass = getAspectClass(index)

          return (
            <motion.article 
              key={project.slug} 
              variants={fadeUp}
              className="group flex flex-col space-y-4"
            >
              {/* Media card wrapper (zoom on hover, elevation change) */}
              <Link 
                to={`/projects/${project.slug}`}
                className="block relative w-full overflow-hidden rounded-lg border border-borderSubtle bg-panel shadow-panel transition-all duration-300 hover:border-borderHover hover:-translate-y-1 hover:shadow-panelHover"
              >
                <div className={`relative w-full ${aspectClass}`}>
                  <ArchiveCardVisual 
                    title={project.title} 
                    thumbnailUrl={project.thumbnail_url} 
                    index={index} 
                    primaryTech={primaryTech} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </Link>

              {/* Text metadata */}
              <div className="space-y-2 select-text">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <Link 
                    to={`/projects/${project.slug}`}
                    className="text-muted group-hover:text-accent transition-colors translate-x-0 group-hover:translate-x-1 duration-300 select-none"
                    aria-hidden="true"
                  >
                    →
                  </Link>
                </div>
                <p className="text-sm leading-6 text-muted max-w-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="rounded bg-panelStrong px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-faint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}
