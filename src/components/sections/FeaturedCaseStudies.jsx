import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { getPublicProjects } from '../../services/projectService'

// Architecture diagram component
function ArchDiagram({ lines }) {
  return (
    <div className="rounded border border-accent/15 bg-ink/80 p-4 font-mono text-[11px] leading-6 text-accent/70">
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}

// Static case study data — overlaid with real project data if available
const caseStudyFallbacks = [
  {
    slug: '__fallback_1__',
    title: 'Portfolio CMS & API Platform',
    challenge:
      'Design a content management system with a headless API backend that supports authenticated CRUD operations, project categorisation, and public/private access tiers — all deployable without a managed cloud service.',
    architecture: [
      '┌─ Client (React SPA) ───────────────────────────┐',
      '│  Vite + React Router + Framer Motion           │',
      '└────────────────────┬───────────────────────────┘',
      '                     │ HTTPS',
      '┌────────────────────▼───────────────────────────┐',
      '│  Supabase (BaaS Layer)                          │',
      '│  ├─ REST & Realtime API (PostgREST)             │',
      '│  ├─ Row Level Security Policies                 │',
      '│  └─ Storage (image CDN)                         │',
      '└────────────────────┬───────────────────────────┘',
      '                     │',
      '┌────────────────────▼───────────────────────────┐',
      '│  PostgreSQL (managed)                           │',
      '│  projects, images, metadata tables              │',
      '└────────────────────────────────────────────────┘',
    ],
    tradeoffs:
      'Chose Supabase over a custom Express server to reduce infrastructure overhead while retaining full PostgreSQL access. Row Level Security policies enforce access control at the database layer, eliminating a separate authorization service.',
    wins: [
      'Zero-configuration auth via Supabase JWT',
      'RLS policies enforce public/admin data tiers',
      'Single source of truth for all project metadata',
    ],
    tags: ['NestJS', 'PostgreSQL', 'Supabase', 'React', 'RLS'],
  },
  {
    slug: '__fallback_2__',
    title: 'RESTful API Design Study',
    challenge:
      'Implement a production-pattern REST API with structured routing, middleware validation, JWT authentication, and layered error handling — without leaning on auto-generated boilerplate.',
    architecture: [
      '┌─ HTTP Request ─────────────────────────────────┐',
      '└──────────────────┬─────────────────────────────┘',
      '                   │',
      '┌──────────────────▼─────────────────────────────┐',
      '│  Middleware Pipeline                            │',
      '│  ├─ Request Validation (Zod)                    │',
      '│  ├─ Auth Guard (JWT verify)                     │',
      '│  └─ Error Boundary (structured JSON)            │',
      '└──────────────────┬─────────────────────────────┘',
      '                   │',
      '┌──────────────────▼─────────────────────────────┐',
      '│  Service Layer                                  │',
      '│  └─ Business logic, separated from transport   │',
      '└──────────────────┬─────────────────────────────┘',
      '                   │',
      '┌──────────────────▼─────────────────────────────┐',
      '│  Data Access Layer (Prisma ORM)                 │',
      '│  └─ PostgreSQL                                  │',
      '└────────────────────────────────────────────────┘',
    ],
    tradeoffs:
      'Strict separation between transport, service, and data layers makes each independently testable. Zod validation at the boundary means invalid payloads never reach business logic — reducing the surface area for runtime errors.',
    wins: [
      'Structured error responses with error codes',
      'Zero implicit any — full TypeScript coverage',
      'Middleware-first auth — routes stay clean',
    ],
    tags: ['Express.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Zod', 'JWT'],
  },
]

function CaseStudyCard({ study }) {
  return (
    <motion.article
      className="border border-line bg-panel/60 transition-colors duration-300 hover:border-accent/30"
      variants={fadeUp}
    >
      {/* Header */}
      <div className="border-b border-line p-8 lg:p-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent/60">
          Case Study
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {study.title}
        </h3>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Left: Challenge + Tradeoffs + Wins */}
        <div className="border-b border-line p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">The Challenge</p>
            <p className="text-sm leading-7 text-muted">{study.challenge}</p>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
              Design Tradeoffs
            </p>
            <p className="text-sm leading-7 text-muted">{study.tradeoffs}</p>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Technical Wins</p>
            <ul className="space-y-2">
              {study.wins.map((win) => (
                <li key={win} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {win}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Architecture */}
        <div className="p-8 lg:p-10">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">
            System Architecture
          </p>
          <ArchDiagram lines={study.architecture} />

          {/* Stack Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="border border-line bg-ink px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
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

  // Build case study data: prefer real featured projects, fall back to static studies
  const buildCaseStudies = () => {
    if (featuredProjects.length > 0) {
      return featuredProjects.slice(0, 2).map((p) => ({
        slug: p.slug || p.id,
        title: p.title,
        challenge: p.short_description || 'A backend systems engineering project.',
        architecture: [
          `// ${p.title} — System Overview`,
          '// See full documentation for detailed architecture.',
        ],
        tradeoffs: p.short_description || 'Architecture decisions documented in project detail.',
        wins: p.tech_stack
          ? (Array.isArray(p.tech_stack) ? p.tech_stack : [p.tech_stack]).slice(0, 3).map((t) => `Built with ${t}`)
          : ['See project for technical details'],
        tags: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      }))
    }
    return caseStudyFallbacks
  }

  const studies = buildCaseStudies()

  return (
    <motion.section
      id="featured-projects"
      className="scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="case-studies-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-muted">
            Featured Work
          </p>
          <h2
            id="case-studies-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Case Studies
          </h2>
        </div>
        {!isLoading && (
          <p className="font-mono text-xs text-muted/60">
            {featuredProjects.length > 0 ? `${featuredProjects.length} featured project(s) loaded` : 'Showing architecture studies'}
          </p>
        )}
      </div>

      {/* Cards */}
      <motion.div
        className="space-y-6"
        variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {studies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </motion.div>
    </motion.section>
  )
}
