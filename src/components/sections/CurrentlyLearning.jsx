import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const topics = ['Backend Architecture', 'Cloud Fundamentals', 'Blockchain Concepts', 'Security Basics']

export default function CurrentlyLearning() {
  return (
    <motion.section
      className="py-14 sm:py-16"
      aria-labelledby="learning-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeader
        eyebrow="Currently Learning"
        titleId="learning-title"
        title="Topics under active study"
        description="Placeholder learning cards for a public snapshot of technical growth."
      />

      <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
        {topics.map((topic) => (
          <motion.article key={topic} className="border border-line bg-panel/75 p-5 shadow-panel" variants={fadeUp}>
            <p className="text-sm font-semibold text-foreground">{topic}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Placeholder learning note.</p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
