import { useParams } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'

export default function ProjectDetail() {
  const { slug } = useParams()

  return (
    <PublicLayout>
      <section className="flex min-h-[64vh] items-center justify-center">
        <div className="w-full max-w-2xl border border-slate-800 bg-slate-950/70 px-8 py-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Project</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Project Detail Page</h1>
          <p className="mt-4 text-sm text-slate-400">Route placeholder for {slug}</p>
        </div>
      </section>
    </PublicLayout>
  )
}
