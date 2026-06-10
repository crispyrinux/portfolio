import Footer from './Footer'
import Navbar from './Navbar'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <Navbar />
        <main id="top" className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
