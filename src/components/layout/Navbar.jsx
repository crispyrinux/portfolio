const navItems = [
  { label: 'Home', href: '/#top' },
  { label: 'About', href: '/#about' },
  { label: 'Focus', href: '/#focus' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-[#05070b]/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <a
          className="text-sm font-semibold uppercase tracking-[0.35em] text-white"
          href="/#top"
        >
          FBL CMS
        </a>

        <nav aria-label="Public navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
