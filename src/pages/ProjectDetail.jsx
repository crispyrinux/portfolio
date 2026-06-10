import { useParams } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import SectionHeader from '../components/ui/SectionHeader'

export default function ProjectDetail() {
  const { slug } = useParams()

  return (
    <PublicLayout>
      <section className="flex min-h-[64vh] items-center justify-center">
        <div className="w-full max-w-2xl border border-line bg-panel/80 px-8 py-12 text-center shadow-panel">
          <SectionHeader
            eyebrow="Project"
            title="Project Detail Page"
            description={slug ? `Route placeholder for ${slug}` : 'Route placeholder'}
            className="mx-auto max-w-xl text-center"
          />
        </div>
      </section>
    </PublicLayout>
  )
}
