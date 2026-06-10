import PublicLayout from '../components/layout/PublicLayout'
import SectionHeader from '../components/ui/SectionHeader'

export default function Home() {
  return (
    <PublicLayout>
      <section className="flex min-h-[64vh] items-center justify-center">
        <div className="w-full max-w-2xl border border-line bg-panel/80 px-8 py-12 text-center shadow-panel">
          <SectionHeader
            eyebrow="Public Portfolio"
            title="Futuristic Backend Lab Portfolio CMS"
            description="Minimal public homepage placeholder."
            className="mx-auto max-w-xl text-center"
          />
        </div>
      </section>
    </PublicLayout>
  )
}
