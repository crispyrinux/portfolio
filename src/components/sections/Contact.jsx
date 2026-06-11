import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../lib/animations'
import SectionHeader from '../ui/SectionHeader'

const contactLinks = [
  { label: 'Email Placeholder', href: 'mailto:hello@example.com' },
  { label: 'GitHub Placeholder', href: '#contact' },
  { label: 'LinkedIn Placeholder', href: '#contact' },
]

export default function Contact() {
  return (
    <motion.section
      id="contact"
      className="scroll-mt-24 py-14 sm:py-16"
      aria-labelledby="contact-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8 lg:p-10" variants={fadeUp}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="Contact"
            titleId="contact-title"
            title="Open for future public contact details"
            description="Placeholder contact area for safe public links and professional ways to connect."
          />

          <motion.div className="grid gap-3" variants={staggerContainer}>
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                className="border border-line bg-ink/70 p-4 text-sm text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
                href={link.href}
                variants={fadeUp}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
