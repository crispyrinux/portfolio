import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Home, User, Target, FolderGit, Mail } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { name: 'Home', url: '/#top', icon: Home },
  { name: 'About', url: '/#about', icon: User },
  { name: 'Focus', url: '/#focus', icon: Target },
  { name: 'Projects', url: '/#projects', icon: FolderGit },
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
    <>
      {/* System Status Indicator — top-right corner on desktop */}
      <div className="fixed right-4 top-4 z-50 hidden items-center gap-2 md:flex" aria-label="System status">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
          System Active
        </span>
      </div>

      {/* Navbar pill */}
      <header
        className={cn(
          "fixed bottom-6 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 z-50 mb-6 md:pt-0",
          className,
        )}
      >
        <div className="flex items-center gap-3 bg-panel/95 border border-line py-1.5 px-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-xs uppercase tracking-[0.15em] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center justify-center min-h-[38px]",
                  "text-muted hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-accent-soft rounded-full -z-10 border border-accent/20"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-t-full">
                      <div className="absolute w-12 h-6 bg-accent/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-accent/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-accent/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </a>
            )
          })}
        </div>
      </header>
    </>
  )
}
