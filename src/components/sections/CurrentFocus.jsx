import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const focusAreas = [
  {
    title: 'Backend Development',
    description: 'Building scalable backend services using modern frameworks, clean architecture principles, and structured development workflows.',
  },
  {
    title: 'Database Engineering',
    description: 'Designing efficient schemas, maintaining data consistency, and improving how applications interact with data.',
  },
  {
    title: 'System Architecture',
    description: 'Learning how software systems are structured to achieve reliability, scalability, and long-term maintainability.',
  },
  {
    title: 'Cloud Fundamentals',
    description: 'Exploring deployment workflows, infrastructure concepts, and cloud-based application development.',
  },
  {
    title: 'Software Engineering',
    description: 'Applying clean code principles, version control practices, and collaborative development workflows.',
  },
]

export default function CurrentFocus() {
  return (
    <motion.section
      id="focus"
      className="scroll-mt-24 py-14 sm:py-16"
      aria-labelledby="focus-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeader
        eyebrow="Current Focus"
        titleId="focus-title"
        title="Technical areas under active exploration"
        description="A snapshot of backend engineering topics I am currently studying and practicing."
      />

      <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
        {focusAreas.map((area) => (
          <motion.article key={area.title} className="border border-line bg-panel/75 p-6 shadow-panel" variants={fadeUp}>
            <p className="text-sm font-semibold text-foreground">{area.title}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{area.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
