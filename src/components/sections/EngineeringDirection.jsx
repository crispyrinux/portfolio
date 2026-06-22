import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const directionSteps = [
  {
    title: 'Understand the problem surface',
    description: 'Analyzing system requirements, data boundaries, and API requirements.',
  },
  {
    title: 'Design the data and service boundaries',
    description: 'Designing normalized schemas, database relations, and service layers.',
  },
  {
    title: 'Build simple, testable backend flows',
    description: 'Writing clean server logic, handling errors, and implementing unit tests.',
  },
  {
    title: 'Prepare for deployment and iteration',
    description: 'Setting up container environments, pipeline actions, and deploy scripts.',
  },
]

export default function EngineeringDirection() {
  return (
    <motion.section
      className="py-14 sm:py-16"
      aria-labelledby="direction-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="border border-line bg-panel/70 p-6 shadow-panel sm:p-8 lg:p-10" variants={fadeUp}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Engineering Direction"
            titleId="direction-title"
            title="A structured workflow for backend development"
            description="My step-by-step approach to analyzing problems, designing systems, and building maintainable backend applications."
          />

          <motion.div className="space-y-4" variants={staggerContainer}>
            {directionSteps.map((step, index) => (
              <motion.div key={step.title} className="grid grid-cols-[auto_1fr] gap-4 border border-line bg-ink/70 p-4" variants={fadeUp}>
                <span className="flex h-9 w-9 items-center justify-center border border-accent/50 bg-accent-soft text-sm text-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
