import SectionHeader from '../ui/SectionHeader'

export default function ProjectLab() {
  return (
    <section className="py-14 sm:py-16" aria-labelledby="project-lab-title">
      <div className="border border-line bg-panel/70 p-6 shadow-glow sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <SectionHeader
            eyebrow="Project Lab"
            titleId="project-lab-title"
            title="Future CMS-powered project area"
            description="This placeholder reserves space for the next step, where project cards and fallback data can be introduced without connecting external services yet."
          />

          <div className="grid gap-3 text-sm text-muted">
            {['No CMS data connected', 'No project logic implemented', 'Ready for the next scoped task'].map((item) => (
              <div key={item} className="border border-line bg-ink/70 p-4">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
