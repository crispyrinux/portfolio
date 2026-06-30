import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const domains = [
  {
    id: 'api',
    label: 'API Engineering',
    headline: 'Contract-first REST APIs that are predictable, validated, and maintainable.',
    capabilities: ['Resource modeling', 'Middleware pipelines', 'Structured validation', 'JWT authentication'],
    stack: ['NestJS', 'Express.js', 'TypeScript', 'Zod', 'JWT'],
  },
  {
    id: 'database',
    label: 'Database Architecture',
    headline: 'Normalized schemas and data access layers with strong consistency guarantees.',
    capabilities: ['Relational modeling', 'Schema migrations', 'Index planning', 'Transaction safety'],
    stack: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'SQL'],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    headline: 'Repeatable deployments, containerized environments, and production-aware operations.',
    capabilities: ['Linux provisioning', 'Docker environments', 'CI/CD pipelines', 'Cloud VM deployment'],
    stack: ['AWS EC2', 'Docker', 'Linux', 'Bash', 'GitHub Actions'],
  },
]

export default function CoreCapabilities() {
  return (
    <motion.section
      id="focus"
      className="scroll-mt-24 py-32 sm:py-40"
      aria-labelledby="capabilities-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="mb-16 max-w-3xl">
        <h2
          id="capabilities-title"
          className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl"
        >
          Engineering Philosophy
        </h2>
        <p className="mt-5 text-base leading-7 text-muted max-w-2xl">
          Specialized backend domains, mapped by system responsibility instead of percentage bars.
        </p>
      </div>

      <div className="space-y-16 max-w-3xl">
        {domains.map((domain, index) => (
          <motion.article
            key={domain.id}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start"
            variants={fadeUp}
          >
            <span className="text-sm font-medium text-accent/70 pt-1 select-none">0{index + 1}</span>
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                {domain.label}
              </h3>
              <p className="text-base leading-7 text-muted max-w-2xl">{domain.headline}</p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted/80 max-w-xl">
                {domain.capabilities.map((cap, i) => (
                  <span key={cap} className="flex items-center gap-1.5 text-sm text-muted">
                    {i > 0 && <span className="text-faint/50 select-none">·</span>}
                    {cap}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {domain.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-panelStrong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
