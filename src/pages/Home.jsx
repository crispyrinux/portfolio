import PublicLayout from '../components/layout/PublicLayout'
import Hero from '../components/sections/Hero'
import IdentityPrinciples from '../components/sections/IdentityPrinciples'
import CoreCapabilities from '../components/sections/CoreCapabilities'
import FeaturedCaseStudies from '../components/sections/FeaturedCaseStudies'
import EngineeringArchive from '../components/sections/EngineeringArchive'
import EvolutionMap from '../components/sections/EvolutionMap'
import SystemHandshake from '../components/sections/SystemHandshake'

export default function Home() {
  return (
    <PublicLayout>
      {/* 1. Cinematic Hero — unchanged */}
      <Hero />

      {/* Hero-to-Identity transition zone (atmospheric light) */}
      <div className="relative h-[150px] overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Dual purple/blue atmospheric lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,85,255,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.02),transparent_60%)]" />
      </div>

      {/* 2. Identity & Operating Principles */}
      <IdentityPrinciples />

      {/* 3. Featured Case Studies */}
      <FeaturedCaseStudies />

      {/* 4. Engineering Archive */}
      <EngineeringArchive />

      {/* 5. Engineering Philosophy (Core Capabilities) */}
      <CoreCapabilities />

      {/* 6. Evolution & Growth Map */}
      <EvolutionMap />

      {/* 7. System Handshake (Contact) */}
      <SystemHandshake />
    </PublicLayout>
  )
}
