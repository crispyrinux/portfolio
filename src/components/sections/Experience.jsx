import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const experienceItems = [
  {
    period: 'Future Entry',
    title: 'Backend Project Experience',
    description: 'Placeholder for academic, prototype, infrastructure, or deployment work.',
  },
  {
    period: 'Future Entry',
    title: 'Software Engineering Practice',
    description: 'Placeholder for coursework, labs, collaborative work, or technical exercises.',
  },
]

export default function Experience() {
  return (
    <motion.section
      className="py-14 sm:py-16"
      aria-labelledby="experience-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeader
        eyebrow="Experience"
        titleId="experience-title"
        title="Experience timeline placeholder"
        description="Static cards are used for now so real experience can be added later without changing the section shape."
      />

      <motion.div className="mt-8 space-y-4" variants={staggerContainer}>
        {experienceItems.map((item) => (
          <motion.article key={item.title} className="grid gap-4 border border-line bg-panel/75 p-6 shadow-panel md:grid-cols-[0.3fr_1fr]" variants={fadeUp}>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">{item.period}</p>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
