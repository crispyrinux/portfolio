import Container from '../ui/Container'

const navItems = [
  { label: 'Home', href: '/#top' },
  { label: 'About', href: '/#about' },
  { label: 'Focus', href: '/#focus' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  return (
    <header className="border-b border-line bg-ink/90 backdrop-blur">
      <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <a className="text-sm font-semibold uppercase tracking-[0.35em] text-foreground" href="/#top">
          FBL CMS
        </a>

        <nav aria-label="Public navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  )
}
