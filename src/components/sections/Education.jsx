import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

export default function Education() {
  return (
    <motion.section
      className="py-14 sm:py-16"
      aria-labelledby="education-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader
          eyebrow="Education"
          titleId="education-title"
          title="Education card placeholder"
          description="A simple structure for future academic background details."
        />

        <motion.article className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8" variants={fadeUp}>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Academic Profile</p>
          <h3 className="mt-4 text-2xl font-semibold text-foreground">Computer Science Education Placeholder</h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            Placeholder education content for a future degree, coursework, academic projects, and technical
            learning context.
          </p>
          <motion.div className="mt-6 grid gap-3 sm:grid-cols-2" variants={staggerContainer}>
            {['Backend Coursework', 'Software Engineering Labs'].map((item) => (
              <motion.div key={item} className="border border-line bg-ink/70 p-4 text-sm text-muted" variants={fadeUp}>
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.article>
      </div>
    </motion.section>
  )
}
