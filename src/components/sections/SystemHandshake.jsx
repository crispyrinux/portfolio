import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/animations'

const endpoints = [
  { key: 'email', value: 'hammammuhammady@gmail.com', href: 'mailto:hammammuhammady@gmail.com', label: 'Send Email' },
  { key: 'github', value: 'github.com/crispyrinux', href: 'https://github.com/crispyrinux', label: 'GitHub' },
  { key: 'linkedin', value: 'linkedin.com/in/hammam-muhammad-yazid-14407b323', href: 'https://www.linkedin.com/in/hammam-muhammad-yazid-14407b323', label: 'LinkedIn' },
]

export default function SystemHandshake() {
  return (
    <motion.section
      id="contact"
      className="scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="handshake-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Full-bleed container */}
      <div className="border border-line bg-panel/60">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 border-b border-line px-6 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-4 font-mono text-xs text-muted/60">
            POST /api/v1/handshake — 200 OK
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left: API Payload Visual */}
          <div className="border-b border-line p-8 lg:border-b-0 lg:border-r lg:p-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted/60">
              Response Payload
            </p>
            <pre className="font-mono text-sm leading-8 text-foreground/80">
              <span className="text-muted/50">{'{'}</span>
              {'\n'}
              {'  '}<span className="text-accent/80">"status"</span>
              <span className="text-muted/50">: </span>
              <span className="text-emerald-400/80">"accepting_inquiries"</span>
              <span className="text-muted/50">,</span>
              {'\n'}
              {'  '}<span className="text-accent/80">"preferred_roles"</span>
              <span className="text-muted/50">: [</span>
              {'\n'}
              {'    '}<span className="text-foreground/70">"Backend Engineer"</span>
              <span className="text-muted/50">,</span>
              {'\n'}
              {'    '}<span className="text-foreground/70">"Software Engineer Intern"</span>
              {'\n'}
              {'  '}<span className="text-muted/50">],</span>
              {'\n'}
              {'  '}<span className="text-accent/80">"open_to_collaborate"</span>
              <span className="text-muted/50">: </span>
              <span className="text-orange-400/80">true</span>
              <span className="text-muted/50">,</span>
              {'\n'}
              {'  '}<span className="text-accent/80">"handshake_endpoints"</span>
              <span className="text-muted/50">: {'{'}</span>
              {'\n'}
              {endpoints.map((ep) => (
                <span key={ep.key}>
                  {'    '}
                  <span className="text-accent/60">"{ep.key}"</span>
                  <span className="text-muted/50">: </span>
                  <span className="text-foreground/60">"{ep.value}"</span>
                  <span className="text-muted/50">,</span>
                  {'\n'}
                </span>
              ))}
              {'  '}<span className="text-muted/50">{'}'}</span>
              {'\n'}
              <span className="text-muted/50">{'}'}</span>
            </pre>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col justify-between p-8 lg:p-12">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.38em] text-muted">
                System Handshake
              </p>
              <h2
                id="handshake-title"
                className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Let's build something
                <br />
                <span className="text-muted font-normal">that holds up.</span>
              </h2>
              <p className="mb-10 max-w-sm text-sm leading-7 text-muted">
                Open for backend engineering roles, internship opportunities, and technical collaborations. If you have a system that needs careful design, reach out.
              </p>
            </div>

            <div className="space-y-3">
              {/* Primary CTA */}
              <a
                href="mailto:hammammuhammady@gmail.com"
                className="group flex items-center justify-between border border-accent/60 bg-accent/10 px-6 py-4 transition-colors duration-200 hover:bg-accent/20"
              >
                <span className="text-sm font-semibold text-foreground">Execute Handshake</span>
                <span className="font-mono text-xs text-accent group-hover:translate-x-0.5 transition-transform duration-150">
                  → Email
                </span>
              </a>

              {/* Secondary links */}
              {endpoints.slice(1).map((ep) => (
                <a
                  key={ep.key}
                  href={ep.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border border-line bg-ink/50 px-6 py-3 transition-colors duration-200 hover:border-line/60 hover:bg-panel/60"
                >
                  <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                    {ep.label}
                  </span>
                  <span className="font-mono text-xs text-muted/50 group-hover:text-muted group-hover:translate-x-0.5 transition-all duration-150">
                    → {ep.value.split('/')[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
