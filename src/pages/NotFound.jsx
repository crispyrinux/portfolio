import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import SectionHeader from '../components/ui/SectionHeader'

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="flex min-h-[64vh] items-center justify-center">
        <div className="w-full max-w-xl border border-line bg-panel/80 px-8 py-12 text-center shadow-panel">
          <SectionHeader
            eyebrow="404"
            title="Page not found"
            description="The page you requested does not exist."
            className="mx-auto max-w-xl text-center"
          />
          <Link
            className="mt-6 inline-flex border border-line px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
            to="/"
          >
            Return home
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
