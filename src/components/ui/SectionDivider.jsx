import React from 'react'

export default function SectionDivider({ label = 'SYS_PARTITION', value = '0x00' }) {
  return (
    <div className="relative my-20 flex items-center justify-center sm:my-24" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dashed border-line"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-ink px-4 font-mono text-[10px] tracking-[0.25em] text-muted/40">
          {label} // {value}
        </span>
      </div>
    </div>
  )
}
