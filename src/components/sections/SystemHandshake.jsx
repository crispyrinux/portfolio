import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const endpoints = [
  { key: 'email', value: 'hammammuhammady@gmail.com', href: 'mailto:hammammuhammady@gmail.com', label: 'Email' },
  { key: 'github', value: 'github.com/crispyrinux', href: 'https://github.com/crispyrinux', label: 'GitHub' },
  { key: 'linkedin', value: 'LinkedIn profile', href: 'https://www.linkedin.com/in/hammam-muhammad-yazid-14407b323', label: 'LinkedIn' },
]

export default function SystemHandshake() {
  return (
    <motion.section
      id="contact"
      className="scroll-mt-24 py-32 sm:py-40"
      aria-labelledby="handshake-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <h2
            id="handshake-title"
            className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl"
          >
            Let’s build systems that hold up.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">
            Open for backend engineering roles, internship opportunities, and technical collaborations.
            If you have a system that needs careful design, reach out.
          </p>
        </div>

        <div className="space-y-3">
          {endpoints.map((ep, index) => (
            <a
              key={ep.key}
              href={ep.href}
              target={ep.key === 'email' ? undefined : '_blank'}
              rel={ep.key === 'email' ? undefined : 'noopener noreferrer'}
              className={`group flex items-center justify-between rounded-lg px-5 py-4 transition-all duration-300 ${
                index === 0
                  ? 'bg-accent text-ink hover:bg-accent-hover font-medium'
                  : 'bg-panel border border-borderSubtle text-muted hover:bg-panelStrong hover:border-borderHover hover:text-foreground'
              }`}
            >
              <span className="text-sm font-medium">{ep.label}</span>
              <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">
                {ep.value} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
