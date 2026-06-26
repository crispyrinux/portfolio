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
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="identity-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Identity Block */}
      <div className="mb-24 border-l-2 border-accent/40 pl-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent/80">
          SYS // IDENTITY
        </p>
        <h2
          id="identity-title"
          className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
        >
          I engineer backend systems.
          <br />
          <span className="text-muted font-light">Not websites.</span>
        </h2>
        <p className="mt-8 max-w-xl text-sm leading-7 text-muted">
          Computer Science student at Universitas Gadjah Mada with a focused practice in API
          design, relational database architecture, and server-side systems engineering. My
          interest lies in building backend infrastructure that is predictable, correct, and
          maintainable — systems that hold up under production conditions.
        </p>
      </div>

      {/* Operating Principles */}
      <div>
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
          SYS // OPERATING_PRINCIPLES
        </p>
        <motion.div
          className="grid gap-px border border-line bg-line/60 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {principles.map((p) => (
            <motion.div
              key={p.index}
              className="group relative bg-ink/90 p-8 transition-colors duration-200 hover:bg-panel sm:p-10"
              variants={fadeUp}
            >
              <span className="mb-6 block font-mono text-xs text-accent/40">{p.index}</span>
              <h3 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="text-xs leading-6 text-muted">{p.body}</p>
              <p className="mt-6 font-mono text-[10px] tracking-[0.1em] text-accent/50">
                {p.tag}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
