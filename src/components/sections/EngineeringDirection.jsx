import SectionHeader from '../ui/SectionHeader'

const directionSteps = [
  'Understand the problem surface',
  'Design the data and service boundaries',
  'Build simple, testable backend flows',
  'Prepare for deployment and iteration',
]

export default function EngineeringDirection() {
  return (
    <section className="py-14 sm:py-16" aria-labelledby="direction-title">
      <div className="border border-line bg-panel/70 p-6 shadow-panel sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Engineering Direction"
            titleId="direction-title"
            title="A lab-style path for backend growth"
            description="This placeholder narrative frames the portfolio as a technical lab for backend systems, scalable products, and practical software engineering habits."
          />

          <div className="space-y-4">
            {directionSteps.map((step, index) => (
              <div key={step} className="grid grid-cols-[auto_1fr] gap-4 border border-line bg-ink/70 p-4">
                <span className="flex h-9 w-9 items-center justify-center border border-accent/50 bg-accent-soft text-sm text-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{step}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Placeholder detail for a future technical direction entry.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
