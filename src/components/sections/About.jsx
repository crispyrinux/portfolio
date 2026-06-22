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
          title="Hammam Muhammad Yazid"
          description="Computer Science Student & Backend Developer"
        />

        <motion.div
          className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8"
          variants={fadeUp}
        >
          <div className="space-y-4 text-base leading-8 text-muted">
            <p>
              I am Hammam Muhammad Yazid, a Computer Science student at Universitas Gadjah Mada with a strong interest in backend engineering. I enjoy designing APIs, modeling databases, and building maintainable software systems that solve real-world problems.
            </p>
            <p>
              My learning approach is highly project-driven, allowing me to explore software architecture, backend development workflows, and engineering best practices through practical implementation. I focus on writing clean, structured, and scalable solutions while continuously improving my understanding of modern software systems.
            </p>
          </div>
          <motion.div className="mt-6 grid gap-3 sm:grid-cols-3" variants={staggerContainer}>
            {[
              {
                title: 'API Engineering',
                description: 'Building reliable APIs with clear contracts, validation, authentication, and structured architecture.',
              },
              {
                title: 'Database Design',
                description: 'Creating efficient data models and database structures that support consistency, performance, and future scalability.',
              },
              {
                title: 'System Design',
                description: 'Designing backend systems that remain maintainable, scalable, and adaptable as requirements evolve.',
              },
            ].map((item) => (
              <motion.div key={item.title} className="border border-line bg-ink/70 p-4" variants={fadeUp}>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
