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
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="handshake-title"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Full-bleed container */}
      <div className="border border-line/60 bg-panel/30 rounded-xl overflow-hidden shadow-panel">
        {/* Terminal title bar */}
        <div className="flex items-center justify-between border-b border-line/40 bg-panel/50 px-6 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-muted/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted/20" />
            <span className="ml-3 font-mono text-[10px] text-muted/50">
              SYS // ENDPOINT_HANDSHAKE
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wide text-emerald-400/70 bg-emerald-400/5 px-2 py-0.5 border border-emerald-400/10 rounded">
            POST /api/v1/handshake — 200 OK
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left: API Payload Visual */}
          <div className="border-b border-line/40 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">
              Response Payload
            </p>
            <pre className="font-mono text-xs leading-6 text-foreground/80 overflow-x-auto whitespace-pre">
              <span className="text-muted/40">{'{'}</span>
              {'\n'}
              {'  '}<span className="text-accent/70">"status"</span>
              <span className="text-muted/40">: </span>
              <span className="text-emerald-400/70">"accepting_inquiries"</span>
              <span className="text-muted/40">,</span>
              {'\n'}
              {'  '}<span className="text-accent/70">"preferred_roles"</span>
              <span className="text-muted/40">: [</span>
              {'\n'}
              {'    '}<span className="text-foreground/70">"Backend Engineer"</span>
              <span className="text-muted/40">,</span>
              {'\n'}
              {'    '}<span className="text-foreground/70">"Software Engineer Intern"</span>
              {'\n'}
              {'  '}<span className="text-muted/40">],</span>
              {'\n'}
              {'  '}<span className="text-accent/70">"open_to_collaborate"</span>
              <span className="text-muted/40">: </span>
              <span className="text-orange-400/70">true</span>
              <span className="text-muted/40">,</span>
              {'\n'}
              {'  '}<span className="text-accent/70">"handshake_endpoints"</span>
              <span className="text-muted/40">: {'{'}</span>
              {'\n'}
              {endpoints.map((ep) => (
                <span key={ep.key}>
                  {'    '}
                  <span className="text-accent/50">"{ep.key}"</span>
                  <span className="text-muted/40">: </span>
                  <span className="text-foreground/60">"{ep.value}"</span>
                  <span className="text-muted/40">,</span>
                  {'\n'}
                </span>
              ))}
              {'  '}<span className="text-muted/40">{'}'}</span>
              {'\n'}
              <span className="text-muted/40">{'}'}</span>
            </pre>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12">
            <div className="mb-10 lg:mb-0">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
                SYS // CONNECT
              </p>
              <h2
                id="handshake-title"
                className="mb-4 text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl"
              >
                Let's build systems
                <br />
                <span className="text-muted font-light">that hold up.</span>
              </h2>
              <p className="max-w-xs text-xs leading-6 text-muted">
                Open for backend engineering roles, internship opportunities, and technical collaborations. If you have a system that needs careful design, reach out.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Primary CTA */}
              <a
                href="mailto:hammammuhammady@gmail.com"
                className="group flex items-center justify-between border border-accent/40 bg-accent/5 px-5 py-3.5 rounded-lg transition-colors duration-200 hover:bg-accent/10"
              >
                <span className="text-xs font-semibold text-foreground">Execute Handshake</span>
                <span className="font-mono text-[10px] text-accent group-hover:translate-x-0.5 transition-transform duration-150">
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
                  className="group flex items-center justify-between border border-line bg-ink/30 px-5 py-3 rounded-lg transition-colors duration-200 hover:border-line/60 hover:bg-panel/40"
                >
                  <span className="text-xs text-muted group-hover:text-foreground transition-colors">
                    {ep.label}
                  </span>
                  <span className="font-mono text-[9px] text-muted/40 group-hover:text-muted/60 group-hover:translate-x-0.5 transition-all duration-150">
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
