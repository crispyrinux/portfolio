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

export default function CoreCapabilities() {
  return (
    <motion.section
      id="focus"
      className="scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="capabilities-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Section Header */}
      <div className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-muted">
            Core Capabilities
          </p>
          <h2
            id="capabilities-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Engineering Domains
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Mapped by problem domain, not percentage bars.
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
        {domains.map((domain) => (
          <motion.div
            key={domain.id}
            className="group flex flex-col border border-line bg-panel/60 p-7 transition-colors duration-300 hover:border-accent/30 hover:bg-panel"
            variants={fadeUp}
          >
            {/* Label */}
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent/70">
              {domain.label}
            </p>

            {/* Headline */}
            <p className="mb-6 text-base font-semibold leading-7 text-foreground">
              {domain.headline}
            </p>

            {/* Capabilities list */}
            <ul className="mb-8 flex-1 space-y-2.5">
              {domain.capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-muted">
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                  {cap}
                </li>
              ))}
            </ul>

            {/* Stack Badges */}
            <div className="flex flex-wrap gap-2 border-t border-line pt-5">
              {domain.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-accent/20 bg-accent/8 px-2.5 py-1 font-mono text-[11px] tracking-wide text-accent/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
