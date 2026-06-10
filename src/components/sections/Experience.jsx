import SectionHeader from '../ui/SectionHeader'

const experienceItems = [
  {
    period: 'Future Entry',
    title: 'Backend Project Experience',
    description: 'Placeholder for academic, prototype, infrastructure, or deployment work.',
  },
  {
    period: 'Future Entry',
    title: 'Software Engineering Practice',
    description: 'Placeholder for coursework, labs, collaborative work, or technical exercises.',
  },
]

export default function Experience() {
  return (
    <section className="py-14 sm:py-16" aria-labelledby="experience-title">
      <SectionHeader
        eyebrow="Experience"
        titleId="experience-title"
        title="Experience timeline placeholder"
        description="Static cards are used for now so real experience can be added later without changing the section shape."
      />

      <div className="mt-8 space-y-4">
        {experienceItems.map((item) => (
          <article key={item.title} className="grid gap-4 border border-line bg-panel/75 p-6 shadow-panel md:grid-cols-[0.3fr_1fr]">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">{item.period}</p>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
