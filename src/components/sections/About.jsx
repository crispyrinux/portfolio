import SectionHeader from '../ui/SectionHeader'

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-14 sm:py-16" aria-labelledby="about-title">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <SectionHeader
          eyebrow="About"
          titleId="about-title"
          title="A backend-centered portfolio foundation"
          description="This section is reserved for a concise professional profile."
        />

        <div className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
          <p className="text-base leading-8 text-muted">
            Placeholder profile content for a developer focused on backend development, software engineering,
            academic projects, and technical exploration. This area will later describe real experience,
            interests, and project direction without changing the public layout structure.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['Systems Thinking', 'Clean APIs', 'Learning Lab'].map((item) => (
              <div key={item} className="border border-line bg-ink/70 p-4">
                <p className="text-sm font-medium text-foreground">{item}</p>
                <p className="mt-2 text-xs leading-5 text-muted">Placeholder capability note.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
