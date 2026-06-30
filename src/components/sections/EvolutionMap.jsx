import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const phases = [
  {
    phase: 'Phase 01',
    period: '2023 — Early 2024',
    title: 'Core Systems & CS Foundations',
    description:
      'Grounding in computer science fundamentals at Universitas Gadjah Mada: algorithms and data structures, relational database theory, computer networks, and operating systems.',
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
      'Hands-on construction of REST APIs from first principles — routing, middleware design, input validation, JWT authentication, and structured error handling.',
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
      'Expanding from local development to production-aware infrastructure: Docker, GitHub Actions, AWS EC2, structured logging, and graceful error surfaces.',
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
      id="evolution"
      className="scroll-mt-24 py-32 sm:py-40"
      aria-labelledby="evolution-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="mb-20 max-w-3xl">
        <h2
          id="evolution-title"
          className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl"
        >
          Evolution & Growth Map
        </h2>
        <p className="mt-5 text-base leading-7 text-muted max-w-2xl">
          A phased view of technical development — structured like an engineering roadmap, not a CV.
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute left-[7px] top-0 h-full w-px bg-borderSubtle sm:left-[11px]"
          aria-hidden="true"
        />

        <div className="space-y-12">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              className="relative pl-10 sm:pl-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div
                className={`absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border sm:h-[23px] sm:w-[23px] ${
                  phase.status === 'active'
                    ? 'border-accent bg-accent/10'
                    : 'border-borderDefault bg-ink'
                }`}
                aria-hidden="true"
              >
                {phase.status === 'active' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </div>

              <div className="py-2">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-accent/80">{phase.phase}</span>
                  <span className="text-sm text-faint">·</span>
                  <span className="text-sm text-muted">{phase.period}</span>
                  {phase.status === 'active' && (
                    <span className="rounded-md bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="mb-4 text-2xl font-medium tracking-tight text-foreground">
                  {phase.title}
                </h3>

                <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">{phase.description}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {phase.milestones.map((m) => (
                    <div key={m} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-20 border-t border-borderSubtle pt-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint pt-1">Academic Anchor</p>
          <div>
            <p className="text-lg font-medium text-foreground">
              Computer Science — Universitas Gadjah Mada
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Core curriculum covering database systems, software engineering, algorithms, data structures, and computer networks.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Database Systems', 'Software Engineering', 'Algorithms & Data Structures', 'Computer Networks'].map((c) => (
                <span key={c} className="rounded-md bg-panelStrong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
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
