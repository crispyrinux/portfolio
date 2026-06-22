import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const topics = [
  {
    title: 'NestJS & Express.js',
    description: 'Building structured REST APIs and service layers using modern Node.js frameworks.',
  },
  {
    title: 'PostgreSQL & MySQL',
    description: 'Designing relational schemas, optimizing queries, and handling transactional database workflows.',
  },
  {
    title: 'Prisma ORM & JWT',
    description: 'Integrating data access layers and implementing secure token-based authentication protocols.',
  },
  {
    title: 'AWS EC2 & Linux',
    description: 'Configuring virtual servers, managing environments, and deploying server-side applications.',
  },
]

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
        title="Technologies & Frameworks"
        description="A snapshot of the backend stack, tools, and platforms under active study."
      />

      <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
        {topics.map((topic) => (
          <motion.article key={topic.title} className="border border-line bg-panel/75 p-5 shadow-panel" variants={fadeUp}>
            <p className="text-sm font-semibold text-foreground">{topic.title}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{topic.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}
