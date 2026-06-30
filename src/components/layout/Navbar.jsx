import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Home, User, Target, FolderGit, Mail } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { name: 'Home', url: '/#top', icon: Home },
  { name: 'About', url: '/#about', icon: User },
  { name: 'Projects', url: '/#featured-projects', icon: FolderGit },
  { name: 'Philosophy', url: '/#focus', icon: Target },
  { name: 'Contact', url: '/#contact', icon: Mail },
]

export default function Navbar({ className }) {
  const [activeTab, setActiveTab] = useState(navItems[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className={cn(
        "fixed bottom-6 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 z-50 mb-6 md:pt-0",
        className,
      )}
    >
      <nav className="flex items-center gap-1 bg-[#05070f]/95 border border-borderSubtle py-1 px-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-[11px] uppercase tracking-[0.12em] font-medium px-4 py-2 rounded-full transition-all duration-200 flex items-center justify-center min-h-[36px]",
                "text-muted hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={16} strokeWidth={2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 w-full rounded-full -z-10 bg-white/[0.06] border border-borderDefault"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                />
              )}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
