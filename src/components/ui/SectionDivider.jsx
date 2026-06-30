import React from 'react'

export default function SectionDivider({ label = 'SYS_PARTITION', value = '0x00' }) {
  return (
    <div className="relative my-24 flex items-center justify-center sm:my-28" aria-hidden="true">
      {/* Gradient line — fades from transparent to subtle to transparent */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-line/40 to-transparent"></div>
      </div>
      {/* Label badge */}
      <div className="relative flex justify-center">
        <span className="bg-ink px-6 font-mono text-[9px] tracking-[0.3em] text-muted/25 uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
