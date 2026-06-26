import PublicLayout from '../components/layout/PublicLayout'
import Hero from '../components/sections/Hero'
import IdentityPrinciples from '../components/sections/IdentityPrinciples'
import CoreCapabilities from '../components/sections/CoreCapabilities'
import FeaturedCaseStudies from '../components/sections/FeaturedCaseStudies'
import SandboxLab from '../components/sections/SandboxLab'
import EvolutionMap from '../components/sections/EvolutionMap'
import SystemHandshake from '../components/sections/SystemHandshake'
import SectionDivider from '../components/ui/SectionDivider'

export default function Home() {
  return (
    <PublicLayout>
      {/* 1. Cinematic Hero — unchanged */}
      <Hero />

      {/* 2. Identity & Operating Principles — replaces About + CurrentFocus + EngineeringDirection */}
      <IdentityPrinciples />

      <SectionDivider label="SYS_DOMAINS" value="0x01" />

      {/* 3. Core Capabilities & Stack — replaces CurrentlyLearning */}
      <CoreCapabilities />

      <SectionDivider label="SYS_CASE_STUDIES" value="0x02" />

      {/* 4. Featured Case Studies — replaces FeaturedProjects */}
      <FeaturedCaseStudies />

      <SectionDivider label="SYS_SANDBOX" value="0x03" />

      {/* 5. The Sandbox Lab — replaces ProjectLab */}
      <SandboxLab />

      <SectionDivider label="SYS_JOURNEY" value="0x04" />

      {/* 6. Evolution & Growth Map — replaces Experience + Education */}
      <EvolutionMap />

      <SectionDivider label="SYS_CONTACT" value="0x05" />

      {/* 7. System Handshake — replaces Contact */}
      <SystemHandshake />
    </PublicLayout>
  )
}
