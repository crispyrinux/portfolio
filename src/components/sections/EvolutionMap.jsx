import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const phases = [
  {
    phase: 'Phase 01',
    period: '2023 — Early 2024',
    title: 'Core Systems & CS Foundations',
    description:
      'Grounding in computer science fundamentals at Universitas Gadjah Mada: algorithms and data structures, relational database theory (normalization, ACID, indexing), computer networks, and operating systems. The conceptual layer that everything else is built on.',
    milestones: [
      'Relational database theory & normalization',
      'Algorithms & computational complexity',
      'Network protocols & client-server model',
      'Linux fundamentals & process management',
    ],
    status: 'complete',
  },
  {
    phase: 'Phase 02',
    period: 'Mid 2024 — Early 2025',
    title: 'API Engineering & Backend Patterns',
    description:
      'Hands-on construction of REST APIs from first principles — routing, middleware design, input validation, JWT authentication, and structured error handling. Adopted Prisma ORM and PostgreSQL for data access; enforced TypeScript throughout.',
    milestones: [
      'RESTful API design & resource modeling',
      'JWT auth & token lifecycle management',
      'Prisma ORM & schema migration workflows',
      'Middleware pipeline composition',
    ],
    status: 'complete',
  },
  {
    phase: 'Phase 03',
    period: '2025 — Present',
    title: 'Scalability, Infrastructure & Systems Thinking',
    description:
      'Expanding from local development to production-aware infrastructure: containerization with Docker, deployment automation with GitHub Actions, cloud VM configuration on AWS EC2, and service reliability patterns including structured logging and graceful error surfaces.',
    milestones: [
      'Docker containerization & environment parity',
      'AWS EC2 provisioning & Linux server hardening',
      'GitHub Actions CI/CD pipeline design',
      'NestJS modular architecture patterns',
    ],
    status: 'active',
  },
]

export default function EvolutionMap() {
  return (
    <motion.section
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="evolution-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Header */}
      <div className="mb-16">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">SYS // ENGINEERING_JOURNEY</p>
        <h2
          id="evolution-title"
          className="text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl"
        >
          Evolution & Growth Map
        </h2>
        <p className="mt-3 max-w-xl text-xs leading-6 text-muted">
          A phased view of technical development — structured like an engineering roadmap, not a CV.
        </p>
      </div>

      {/* Git-branch-style timeline */}
      <div className="relative">
        {/* Vertical dashed line */}
        <div
          className="absolute left-[7px] top-0 h-full w-px border-l border-dashed border-line sm:left-[11px]"
          aria-hidden="true"
        />

        <div className="space-y-0">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              className="relative pl-10 sm:pl-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Branch node */}
              <div
                className={`absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border sm:h-[23px] sm:w-[23px] ${
                  phase.status === 'active'
                    ? 'border-accent bg-accent/10'
                    : 'border-line bg-ink'
                }`}
                aria-hidden="true"
              >
                {phase.status === 'active' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </div>

              {/* Content card */}
              <div
                className={`mb-0 border-b border-line/40 py-8 ${
                  idx === phases.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] text-accent/70">{phase.phase}</span>
                  <span className="font-mono text-[10px] text-muted/30">·</span>
                  <span className="font-mono text-[10px] text-muted/50">{phase.period}</span>
                  {phase.status === 'active' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent/80">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-base font-bold tracking-tight text-foreground">
                  {phase.title}
                </h3>

                <p className="mb-5 max-w-xl text-xs leading-6 text-muted">{phase.description}</p>

                {/* Milestones */}
                <div className="grid gap-2 sm:grid-cols-2">
                  {phase.milestones.map((m) => (
                    <div key={m} className="flex items-start gap-2 text-xs text-muted/80">
                      <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education footnote */}
      <motion.div
        className="mt-14 border border-line bg-panel/20 p-6 sm:p-8 rounded-lg"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/40">Academic Anchor</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Computer Science — Universitas Gadjah Mada
            </p>
            <p className="mt-2 text-xs leading-5 text-muted max-w-xl">
              Core curriculum covering database systems, software engineering, algorithms, data structures, and computer networks. The academic and self-directed tracks run in parallel — theory reinforcing practice.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Database Systems', 'Software Engineering', 'Algorithms & Data Structures', 'Computer Networks'].map((c) => (
                <span key={c} className="border border-line bg-ink/30 px-2 py-0.5 font-mono text-[9px] text-muted/60">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
