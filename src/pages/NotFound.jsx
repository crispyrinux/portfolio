import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-slate-100">
      <section className="w-full max-w-xl border border-slate-800 bg-slate-950/70 px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Page not found</h1>
        <p className="mt-4 text-sm text-slate-400">The page you requested does not exist.</p>
        <Link className="mt-6 inline-flex text-sm text-slate-200 underline decoration-slate-600 underline-offset-4" to="/">
          Return home
        </Link>
      </section>
    </main>
  )
}
