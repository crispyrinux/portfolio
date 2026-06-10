import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { slug } = useParams()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-slate-100">
      <section className="w-full max-w-2xl border border-slate-800 bg-slate-950/70 px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Project</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Project Detail Page</h1>
        <p className="mt-4 text-sm text-slate-400">Slug: {slug}</p>
      </section>
    </main>
  )
}
