import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'

const principles = [
  {
    index: '01',
    title: 'Data-First Design',
    body: 'A database schema is a contract. Poorly normalized tables, missing foreign key constraints, and undefined cardinality cannot be patched by application logic. Before writing a single route handler, I design the data model — because every architectural decision flows from it.',
    tag: 'Schema · Normalization · Integrity',
  },
  {
    index: '02',
    title: 'Design for Failure',
    body: 'Networks partition. Third-party APIs timeout. Clients send malformed payloads at 3 AM. Resilient systems treat these as expected, not exceptional. Strict input validation, structured error surfaces, and safe failure paths are not edge-case concerns — they are core specifications.',
    tag: 'Validation · Error Handling · Fault Tolerance',
  },
  {
    index: '03',
    title: 'Simplicity Over Hype',
    body: 'Microservices, event sourcing, and distributed caches are solutions to specific, high-scale problems. Before adopting them, I demand a clear answer: does this problem actually require this complexity? The most maintainable system is the least complex one that fully satisfies the requirement.',
    tag: 'Architecture · Tradeoffs · Maintainability',
  },
]

export default function IdentityPrinciples() {
  return (
    <motion.section
      id="about"
      className="scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="identity-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Identity Block */}
      <div className="mb-20 border-l-2 border-accent/60 pl-8">
        <p className="mb-4 text-xs uppercase tracking-[0.38em] text-accent">
          Identity
        </p>
        <h2
          id="identity-title"
          className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          I engineer backend systems.
          <br />
          <span className="text-muted font-normal">Not websites.</span>
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted">
          Computer Science student at Universitas Gadjah Mada with a focused practice in API
          design, relational database architecture, and server-side systems engineering. My
          interest lies in building backend infrastructure that is predictable, correct, and
          maintainable — systems that hold up under production conditions.
        </p>
      </div>

      {/* Operating Principles */}
      <div>
        <p className="mb-10 text-xs uppercase tracking-[0.38em] text-muted">
          Operating Principles
        </p>
        <motion.div
          className="grid gap-px border border-line bg-line sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {principles.map((p) => (
            <motion.div
              key={p.index}
              className="group relative bg-ink p-8 transition-colors duration-300 hover:bg-panel sm:p-10"
              variants={fadeUp}
            >
              <span className="mb-6 block font-mono text-xs text-accent/50">{p.index}</span>
              <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="text-sm leading-7 text-muted">{p.body}</p>
              <p className="mt-6 font-mono text-[11px] tracking-[0.15em] text-accent/60">
                {p.tag}
              </p>
              {/* Subtle hover accent bar */}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent/50 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
