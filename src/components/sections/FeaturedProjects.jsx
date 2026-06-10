import SectionHeader from '../ui/SectionHeader'

const projects = [
  {
    title: 'API Systems Placeholder',
    type: 'Backend Concept',
    description: 'Static placeholder for a future backend project card.',
  },
  {
    title: 'Cloud Deployment Placeholder',
    type: 'Infrastructure Concept',
    description: 'Static placeholder for a future deployment or cloud project.',
  },
  {
    title: 'Blockchain Lab Placeholder',
    type: 'Technical Exploration',
    description: 'Static placeholder for a future blockchain learning project.',
  },
]

export default function FeaturedProjects() {
  return (
    <section id="featured-projects" className="scroll-mt-24 py-14 sm:py-16" aria-labelledby="featured-projects-title">
      <SectionHeader
        eyebrow="Featured Projects"
        titleId="featured-projects-title"
        title="Static project preview area"
        description="These cards are visual placeholders only. Dynamic project data and project card logic will be added later."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="border border-line bg-panel/75 p-6 shadow-panel">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">{project.type}</p>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
