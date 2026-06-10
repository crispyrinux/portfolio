import PublicLayout from '../components/layout/PublicLayout'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'
import CurrentFocus from '../components/sections/CurrentFocus'
import CurrentlyLearning from '../components/sections/CurrentlyLearning'
import Education from '../components/sections/Education'
import EngineeringDirection from '../components/sections/EngineeringDirection'
import Experience from '../components/sections/Experience'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import Hero from '../components/sections/Hero'
import ProjectLab from '../components/sections/ProjectLab'

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <About />
      <CurrentFocus />
      <EngineeringDirection />
      <Experience />
      <Education />
      <FeaturedProjects />
      <ProjectLab />
      <CurrentlyLearning />
      <Contact />
    </PublicLayout>
  )
}
