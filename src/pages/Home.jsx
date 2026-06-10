import PublicLayout from '../components/layout/PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      <section className="flex min-h-[64vh] items-center justify-center">
        <div className="w-full max-w-2xl border border-slate-800 bg-slate-950/70 px-8 py-12 text-center shadow-[0_0_40px_rgba(59,130,246,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Public Portfolio</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Futuristic Backend Lab Portfolio CMS
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Minimal public homepage placeholder.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
