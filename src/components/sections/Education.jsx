import SectionHeader from '../ui/SectionHeader'

export default function Education() {
  return (
    <section className="py-14 sm:py-16" aria-labelledby="education-title">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader
          eyebrow="Education"
          titleId="education-title"
          title="Education card placeholder"
          description="A simple structure for future academic background details."
        />

        <article className="border border-line bg-panel/75 p-6 shadow-panel sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Academic Profile</p>
          <h3 className="mt-4 text-2xl font-semibold text-foreground">Computer Science Education Placeholder</h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            Placeholder education content for a future degree, coursework, academic projects, and technical
            learning context.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Backend Coursework', 'Software Engineering Labs'].map((item) => (
              <div key={item} className="border border-line bg-ink/70 p-4 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
