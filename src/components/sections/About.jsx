import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

export default function About() {
  return (
    <motion.section
      id="about"
      className="scroll-mt-24 py-14 sm:py-16"
      aria-labelledby="about-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <SectionHeader
          eyebrow="About"
          titleId="about-title"
          title="A backend-centered portfolio foundation"
          description="This section is reserved for a concise professional profile."
        />

        <motion.div
          className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8"
          variants={fadeUp}
        >
          <p className="text-base leading-8 text-muted">
            Placeholder profile content for a developer focused on backend development, software engineering,
            academic projects, and technical exploration. This area will later describe real experience,
            interests, and project direction without changing the public layout structure.
          </p>
          <motion.div className="mt-6 grid gap-3 sm:grid-cols-3" variants={staggerContainer}>
            {['Systems Thinking', 'Clean APIs', 'Learning Lab'].map((item) => (
              <motion.div key={item} className="border border-line bg-ink/70 p-4" variants={fadeUp}>
                <p className="text-sm font-medium text-foreground">{item}</p>
                <p className="mt-2 text-xs leading-5 text-muted">Placeholder capability note.</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
