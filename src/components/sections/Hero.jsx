const roles = ['Backend Developer', 'Software Engineer', 'Computer Science Student']

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24" aria-labelledby="hero-title">
      <div className="absolute inset-x-0 top-10 h-48 bg-accent-soft blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="border border-line bg-panel/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted"
              >
                {role}
              </span>
            ))}
          </div>

          <h1
            id="hero-title"
            className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Backend-Focused Developer Portfolio
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Exploring backend systems, software engineering, blockchain technology, and scalable digital products.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center border border-accent bg-accent-soft px-5 py-3 text-sm font-medium text-foreground shadow-glow transition-colors hover:bg-panelStrong"
              href="#projects"
            >
              View Projects
            </a>
            <a
              className="inline-flex items-center justify-center border border-line px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
              href="#contact"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="border border-line bg-panel/80 p-5 shadow-panel">
          <div className="border border-line bg-ink p-5">
            <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
              <span>Lab Mode</span>
              <span>Static Preview</span>
            </div>
            <div className="space-y-4">
              {['API Layer', 'Data Flow', 'Security Boundary', 'Deployment Path'].map((item, index) => (
                <div key={item} className="flex items-center gap-4 border border-line bg-panel/50 p-4">
                  <span className="flex h-8 w-8 items-center justify-center border border-line text-sm text-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item}</p>
                    <p className="mt-1 text-xs text-muted">Placeholder system layer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
