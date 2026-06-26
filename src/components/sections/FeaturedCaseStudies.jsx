import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'
import { useEffect, useState } from 'react'
import { getPublicProjects } from '../../services/projectService'
import SpotlightCard from '../ui/SpotlightCard'

// Custom terminal-like frame for architecture diagram
function TerminalFrame({ lines, filename = 'architecture.log' }) {
  return (
    <div className="rounded-lg border border-line bg-ink/90 shadow-panel overflow-hidden">
      {/* Console Tab Bar */}
      <div className="flex items-center gap-1.5 border-b border-line/40 bg-panel/60 px-4 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/30" />
        <span className="ml-3 font-mono text-[9px] text-muted/40">{filename}</span>
      </div>
      <div className="p-4 font-mono text-[10px] leading-5 text-accent/60 overflow-x-auto whitespace-pre">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
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
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="case-studies-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
            SYS // SYSTEM_ARCH_CASE_STUDIES
          </p>
          <h2
            id="case-studies-title"
            className="text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl"
          >
            Featured Case Studies
          </h2>
        </div>
        {!isLoading && (
          <p className="font-mono text-[10px] text-muted/40">
            {featuredProjects.length > 0 ? `// ${featuredProjects.length} records loaded` : '// static fallbacks loaded'}
          </p>
        )}
      </div>

      {/* Bento Grid Composition */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Primary Case Study (Index 0) */}
        {studies[0] && (
          <motion.div className="lg:col-span-2" variants={fadeUp}>
            <SpotlightCard className="h-full flex flex-col justify-between p-0" containerClassName="h-full">
              {/* Header */}
              <div className="border-b border-line/50 p-6 sm:p-8">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                  SYS // PRIMARY_CASE_STUDY
                </p>
                <h3 className="text-xl font-bold tracking-tighter text-foreground sm:text-2xl">
                  {studies[0].title}
                </h3>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                {/* Left: Content */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">The Challenge</p>
                    <p className="text-xs leading-6 text-muted max-w-sm">{studies[0].challenge}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">Design Tradeoffs</p>
                    <p className="text-xs leading-6 text-muted max-w-sm">{studies[0].tradeoffs}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">Technical Wins</p>
                    <ul className="space-y-1.5">
                      {studies[0].wins.map((win) => (
                        <li key={win} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                          {win}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Architecture & Tech */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">System Architecture</p>
                    <TerminalFrame lines={studies[0].architecture} filename="cms_architecture.log" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-line/30">
                    {studies[0].tags.map((tag) => (
                      <span key={tag} className="border border-line bg-ink/30 px-2 py-0.5 font-mono text-[10px] text-muted/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        )}

        {/* Secondary Case Study (Index 1) */}
        {studies[1] && (
          <motion.div className="lg:col-span-1" variants={fadeUp}>
            <div className="flex h-full flex-col justify-between border border-line bg-panel/30 p-6 sm:p-8 rounded-lg transition-colors duration-200 hover:border-line/60">
              <div>
                {/* Header */}
                <div className="border-b border-line/40 pb-4 mb-6">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted/50">
                    SYS // SUPPORTING_STUDY
                  </p>
                  <h3 className="text-lg font-bold tracking-tighter text-foreground">
                    {studies[1].title}
                  </h3>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">The Challenge</p>
                    <p className="text-xs leading-5 text-muted">{studies[1].challenge}</p>
                  </div>
                  <div>
                    <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">Technical Wins</p>
                    <ul className="space-y-1">
                      {studies[1].wins.map((win) => (
                        <li key={win} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-muted/30" />
                          {win}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">Architecture</p>
                    <TerminalFrame lines={studies[1].architecture} filename="api_design.log" />
                  </div>
                </div>
              </div>

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-line/30">
                {studies[1].tags.map((tag) => (
                  <span key={tag} className="border border-line bg-ink/20 px-2 py-0.5 font-mono text-[10px] text-muted/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

