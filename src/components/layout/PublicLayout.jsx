import Footer from './Footer'
import Navbar from './Navbar'
import Container from '../ui/Container'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink text-foreground">
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
