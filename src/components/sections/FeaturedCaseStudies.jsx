import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../../services/projectService'

const caseStudyFallbacks = [
  {
    slug: '__fallback_1__',
    title: 'Portfolio CMS & API Platform',
    challenge: 'A headless content system with authenticated CRUD, public/private data tiers, and predictable project publishing.',
    tags: ['PostgreSQL', 'Supabase', 'React', 'RLS'],
  },
  {
    slug: '__fallback_2__',
    title: 'RESTful API Design Study',
    challenge: 'A production-pattern REST API with validation, authentication, structured errors, and separated service layers.',
    tags: ['Express.js', 'TypeScript', 'Prisma', 'JWT'],
  },
  {
    slug: '__fallback_3__',
    title: 'Distributed Queue Broker',
    challenge: 'An in-memory TCP message queue with topic routing, message persistence, and consumer load balancing.',
    tags: ['Go', 'Redis', 'TCP', 'Protobuf'],
  }
]

const getOptimizedImageUrl = (url) => {
  if (!url) return url
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return url.replace('/object/public/', '/render/image/public/') + '?width=640&quality=80'
  }
  return url
}

function ProjectVisual({ title, thumbnailUrl, index, primaryTech }) {
  const accentWatermarkClasses = [
    "text-accent/[0.025]",
    "text-accent-purple/[0.025]",
    "text-accent-cyan/[0.025]"
  ]
  const watermarkClass = accentWatermarkClasses[index % accentWatermarkClasses.length]

  if (thumbnailUrl && thumbnailUrl !== '#') {
    return (
      <img
        src={getOptimizedImageUrl(thumbnailUrl)}
        alt={`${title} preview`}
        className="project-card-image-reveal absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      />
    )
  }

  // Fallback gradients per project (Electric Blue, Aurora Purple & Soft Cyan accents on dark canvas)
  const gradients = [
    "bg-[radial-gradient(circle_at_20%_30%,rgba(0,85,255,0.06),transparent_50%),linear-gradient(135deg,#0a0e1b,#05070f_70%)]",
    "bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05),transparent_40%),linear-gradient(120deg,#111627,#05070f_80%)]",
    "bg-[radial-gradient(circle_at_40%_70%,rgba(6,182,212,0.06),transparent_50%),linear-gradient(145deg,#0a0e1b,#05070f_60%)]"
  ]

  const bgGradient = gradients[index % gradients.length]
  const watermarkText = (primaryTech || 'BACKEND').toUpperCase()

  return (
    <div className={`absolute inset-0 ${bgGradient} overflow-hidden`}>
      <span className={`absolute -bottom-10 -right-6 text-[120px] sm:text-[180px] font-semibold leading-none tracking-[-0.08em] ${watermarkClass} select-none pointer-events-none uppercase`}>
        {watermarkText}
      </span>
      <span className="absolute left-8 top-6 text-[11px] font-medium tracking-[0.08em] uppercase text-faint select-none">
        SYSTEM_0{index + 1}
      </span>
    </div>
  )
}

function CaseStudyRow({ study, index }) {
  const isEven = index % 2 === 0
  const hasRealSlug = study.slug && !study.slug.startsWith('__fallback')
  const primaryTech = study.tags && study.tags[0] ? study.tags[0] : 'Backend'

  // Scene-specific highlights
  const textAccents = [
    "text-accent",
    "text-accent-purple",
    "text-accent-cyan"
  ]
  const buttonHoverAccents = [
    "hover:text-accent",
    "hover:text-accent-purple",
    "hover:text-accent-cyan"
  ]
  const glows = [
    "bg-[radial-gradient(circle_at_50%_50%,rgba(0,85,255,0.025),transparent_60%)]",
    "bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_60%)]",
    "bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.025),transparent_60%)]"
  ]

  const textAccent = textAccents[index % textAccents.length]
  const buttonHover = buttonHoverAccents[index % buttonHoverAccents.length]
  const glowBackdrop = glows[index % glows.length]

  return (
    <motion.article 
      variants={fadeUp}
      className={`relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center py-8`}
    >
      {/* Dynamic atmospheric radial glow behind the case study scene */}
      <div className={`absolute -inset-x-20 -inset-y-16 ${glowBackdrop} pointer-events-none select-none`} aria-hidden="true" />

      {/* Huge Thumbnail (Nearly full-width/large aspect) */}
      <div className="w-full lg:w-[58%] aspect-[16/10] relative rounded-lg overflow-hidden group border border-borderSubtle bg-panel shadow-panel hover:border-borderHover transition-all duration-500 z-10">
        <ProjectVisual 
          title={study.title} 
          thumbnailUrl={study.thumbnail_url} 
          index={index} 
          primaryTech={primaryTech} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Editorial Content (Huge spacing, large typography) */}
      <div className="w-full lg:w-[42%] space-y-6 lg:space-y-8 select-text z-10">
        <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${textAccent}`}>
          EXHIBIT 0{index + 1}
        </span>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-foreground leading-[1.1]">
          {study.title}
        </h3>
        <p className="text-base sm:text-lg leading-8 text-muted max-w-xl">
          {study.challenge}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {study.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-md bg-panelStrong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
              {tag}
            </span>
          ))}
        </div>
        <div className="pt-4">
          {hasRealSlug ? (
            <Link
              to={`/projects/${study.slug}`}
              className={`inline-flex items-center gap-2 group/link text-sm font-semibold text-foreground ${buttonHover} transition-colors`}
            >
              View Case Study
              <span className="transition-transform duration-300 group-hover/link:translate-x-1.5 font-light">→</span>
            </Link>
          ) : (
            <span className="text-sm font-medium text-faint">Preview Case Study</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function FeaturedCaseStudies() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const all = await getPublicProjects()
        const featured = Array.isArray(all)
          ? all.filter((p) => p.is_featured === true && p.is_archived !== true)
          : []
        if (isMounted) setFeaturedProjects(featured)
      } catch {
        if (isMounted) setFeaturedProjects([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const studies = featuredProjects.length > 0
    ? featuredProjects.slice(0, 3).map((p) => ({
        slug: p.slug || p.id,
        title: p.title,
        thumbnail_url: p.thumbnail_url || null,
        challenge: p.short_description || 'A backend systems engineering project.',
        tags: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      }))
    : caseStudyFallbacks

  return (
    <motion.section
      id="featured-projects"
      className="scroll-mt-24 py-32 sm:py-40"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="mb-20 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/80 block mb-3 animate-pulse">
          EXHIBITION
        </span>
        <h2
          id="case-studies-title"
          className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl"
        >
          Featured Case Studies
        </h2>
        {!isLoading && (
          <p className="mt-5 text-base leading-7 text-muted max-w-2xl">
            Selected engineering work presented through architectural choices, technical constraints, and systems design.
          </p>
        )}
      </div>

      <div className="space-y-28 lg:space-y-36">
        {studies.map((study, index) => (
          <CaseStudyRow key={study.slug} study={study} index={index} />
        ))}
      </div>
    </motion.section>
  )
}
