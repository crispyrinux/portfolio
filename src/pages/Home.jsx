import PublicLayout from '../components/layout/PublicLayout'
import Hero from '../components/sections/Hero'
import IdentityPrinciples from '../components/sections/IdentityPrinciples'
import CoreCapabilities from '../components/sections/CoreCapabilities'
import FeaturedCaseStudies from '../components/sections/FeaturedCaseStudies'
import SandboxLab from '../components/sections/SandboxLab'
import EvolutionMap from '../components/sections/EvolutionMap'
import SystemHandshake from '../components/sections/SystemHandshake'

export default function Home() {
  return (
    <PublicLayout>
      {/* 1. Cinematic Hero — unchanged */}
      <Hero />

      {/* 2. Identity & Operating Principles — replaces About + CurrentFocus + EngineeringDirection */}
      <IdentityPrinciples />

      {/* 3. Core Capabilities & Stack — replaces CurrentlyLearning */}
      <CoreCapabilities />

      {/* 4. Featured Case Studies — replaces FeaturedProjects */}
      <FeaturedCaseStudies />

      {/* 5. The Sandbox Lab — replaces ProjectLab */}
      <SandboxLab />

      {/* 6. Evolution & Growth Map — replaces Experience + Education */}
      <EvolutionMap />

      {/* 7. System Handshake — replaces Contact */}
      <SystemHandshake />
    </PublicLayout>
  )
}
