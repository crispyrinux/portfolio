import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'

const domains = [
  {
    id: 'api',
    label: '01 / API Engineering',
    headline: 'Designing contract-first REST APIs that are predictable, validated, and maintainable.',
    capabilities: [
      'RESTful resource modeling & versioning',
      'Middleware pipelines (auth, rate limiting, logging)',
      'Request/response validation & structured errors',
      'JWT-based authentication & token lifecycle',
    ],
    stack: ['NestJS', 'Express.js', 'TypeScript', 'Zod', 'JWT'],
  },
  {
    id: 'database',
    label: '02 / Database Architecture',
    headline: 'Building normalized schemas and efficient data access layers with strong consistency guarantees.',
    capabilities: [
      'Relational schema design & normalization (3NF)',
      'Migration strategies & schema versioning',
      'Query optimization & index planning',
      'Transaction management & data integrity',
    ],
    stack: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'SQL'],
  },
  {
    id: 'infra',
    label: '03 / Infrastructure & Deployment',
    headline: 'Configuring server environments and deployment pipelines for reliable, repeatable releases.',
    capabilities: [
      'Linux server provisioning & management',
      'Docker containerization & environment isolation',
      'CI/CD pipeline configuration (GitHub Actions)',
      'Cloud VM deployment (AWS EC2)',
    ],
    stack: ['AWS EC2', 'Docker', 'Linux', 'Bash', 'GitHub Actions'],
  },
]

import SpotlightCard from '../ui/SpotlightCard'

export default function CoreCapabilities() {
  return (
    <motion.section
      id="focus"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="capabilities-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Section Header */}
      <div className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
            SYS // CORE_DOMAINS
          </p>
          <h2
            id="capabilities-title"
            className="text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl"
          >
            Engineering Focus
          </h2>
        </div>
        <p className="max-w-xs font-mono text-[11px] leading-5 text-muted/60">
          // Mapped by specialized systems domain, not percentage progress bars.
        </p>
      </div>

      {/* Domain Grid */}
      <motion.div
        className="grid gap-5 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {domains.map((domain) => {
          if (domain.id === 'api' || domain.id === 'database') {
            const isApi = domain.id === 'api'
            return (
              <motion.div
                key={domain.id}
                className={isApi ? 'lg:col-span-2' : 'lg:col-span-1'}
                variants={fadeUp}
              >
                <SpotlightCard
                  className="flex h-full flex-col justify-between"
                  containerClassName="h-full"
                >
                  <div>
                    {/* Label */}
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
                      {domain.label}
                    </p>

                    {/* Headline */}
                    <p className="mb-5 text-base font-semibold leading-7 text-foreground">
                      {domain.headline}
                    </p>

                    {/* Capabilities list */}
                    <ul className="mb-6 space-y-2">
                      {domain.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2.5 text-xs text-muted">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 border-t border-line/50 pt-4">
                    {domain.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-line bg-ink/40 px-2.5 py-0.5 font-mono text-[10px] text-muted/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          }

          // Infrastructure (Secondary visual hierarchy - flat bordered box, no spotlight glow)
          return (
            <motion.div
              key={domain.id}
              className="lg:col-span-3"
              variants={fadeUp}
            >
              <div className="flex flex-col border border-line bg-panel/30 p-6 transition-colors duration-200 hover:border-line/60 sm:p-8 rounded-lg">
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  {/* Left: Info */}
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                      {domain.label}
                    </p>
                    <p className="mb-4 text-base font-semibold leading-7 text-foreground">
                      {domain.headline}
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {domain.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-xs text-muted">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-muted/30" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Stack */}
                  <div className="flex flex-col justify-end border-t border-line/40 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-muted/40">
                      Deployment Stack
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-line bg-ink/20 px-2.5 py-0.5 font-mono text-[10px] text-muted/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
