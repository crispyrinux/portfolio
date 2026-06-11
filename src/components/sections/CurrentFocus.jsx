import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const focusAreas = [
  {
    title: 'Backend Development',
    description: 'Building a stronger foundation in APIs, data flow, and server-side application structure.',
  },
  {
    title: 'Software Engineering',
    description: 'Practicing maintainable code, modular design, and clear technical decision-making.',
  },
  {
    title: 'Blockchain Interest',
    description: 'Exploring distributed systems concepts and the engineering behind blockchain products.',
  },
  {
    title: 'Cloud Computing Path',
    description: 'Learning deployment fundamentals, infrastructure concepts, and scalable service thinking.',
  },
  {
    title: 'Cybersecurity Interest',
    description: 'Studying security basics, authentication boundaries, and responsible application design.',
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
        description="Placeholder focus cards for the public homepage. These can later evolve into managed profile content."
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
