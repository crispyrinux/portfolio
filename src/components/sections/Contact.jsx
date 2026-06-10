import SectionHeader from '../ui/SectionHeader'

const contactLinks = [
  { label: 'Email Placeholder', href: 'mailto:hello@example.com' },
  { label: 'GitHub Placeholder', href: '#contact' },
  { label: 'LinkedIn Placeholder', href: '#contact' },
]

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-14 sm:py-16" aria-labelledby="contact-title">
      <div className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="Contact"
            titleId="contact-title"
            title="Open for future public contact details"
            description="Placeholder contact area for safe public links and professional ways to connect."
          />

          <div className="grid gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                className="border border-line bg-ink/70 p-4 text-sm text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
