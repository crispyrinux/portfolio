import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const principles = [
  {
    index: '01',
    title: 'Data-First Design',
    body: 'A database schema is a contract. Before writing a route handler, I design the data model — because every architectural decision flows from it.',
    tags: ['Schema', 'Normalization', 'Integrity'],
  },
  {
    index: '02',
    title: 'Design for Failure',
    body: 'Networks partition. APIs timeout. Clients send malformed payloads. Resilient systems treat these as expected conditions, not edge cases.',
    tags: ['Validation', 'Error Handling', 'Fault Tolerance'],
  },
  {
    index: '03',
    title: 'Simplicity Over Hype',
    body: 'The most maintainable system is the least complex one that fully satisfies the requirement. Every abstraction must earn its place.',
    tags: ['Architecture', 'Tradeoffs', 'Maintainability'],
  },
]

export default function IdentityPrinciples() {
  return (
    <motion.section
      id="about"
      className="scroll-mt-24 py-32 sm:py-40"
      aria-labelledby="identity-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="mb-20 border-l border-accent pl-6 sm:pl-8">
        <h2
          id="identity-title"
          className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl"
        >
          I engineer backend systems.
          <br />
          <span className="font-light text-muted">Not noise.</span>
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-7 text-muted">
          Computer Science student at Universitas Gadjah Mada focused on API design,
          relational database architecture, and server-side systems engineering. I build
          backend infrastructure that is predictable, correct, and maintainable.
        </p>
      </div>

      <div className="space-y-16 max-w-3xl">
        {principles.map((p) => (
          <motion.article
            key={p.index}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start"
            variants={fadeUp}
          >
            <span className="text-sm font-medium text-accent/70 pt-1 select-none">{p.index}</span>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="text-base leading-7 text-muted max-w-2xl">{p.body}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-panelStrong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint"
                  >
                    {tag}
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
