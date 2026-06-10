import SectionHeader from '../ui/SectionHeader'

const topics = ['Backend Architecture', 'Cloud Fundamentals', 'Blockchain Concepts', 'Security Basics']

export default function CurrentlyLearning() {
  return (
    <section className="py-14 sm:py-16" aria-labelledby="learning-title">
      <SectionHeader
        eyebrow="Currently Learning"
        titleId="learning-title"
        title="Topics under active study"
        description="Placeholder learning cards for a public snapshot of technical growth."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <article key={topic} className="border border-line bg-panel/75 p-5 shadow-panel">
            <p className="text-sm font-semibold text-foreground">{topic}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Placeholder learning note.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
