import Footer from './Footer'
import Navbar from './Navbar'
import Container from '../ui/Container'
import ShaderBackground from '../ui/ShaderBackground'

export default function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen text-foreground selection:bg-accent/20">
      {/* Viewport-sized Fixed Global Aurora Canvas Background */}
      <ShaderBackground />

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="top" className="flex-1">
          <Container className="py-8 sm:py-10 lg:py-12">{children}</Container>
        </main>
        <Footer />
      </div>
    </div>
  )
}
