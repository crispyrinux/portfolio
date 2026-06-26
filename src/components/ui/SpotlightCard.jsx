import React, { useRef, useState } from 'react'

export default function SpotlightCard({
  children,
  className = '',
  containerClassName = '',
  spotlightColor = 'rgba(124, 140, 255, 0.025)',
  borderSpotlightColor = 'rgba(124, 140, 255, 0.25)',
  ...props
}) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-lg border border-line bg-panel/30 p-[1px] transition-all duration-300 hover:border-transparent ${containerClassName}`.trim()}
      style={{
        '--mouse-x': `${position.x}px`,
        '--mouse-y': `${position.y}px`,
        '--opacity': opacity,
        '--spotlight-color': spotlightColor,
        '--border-spotlight-color': borderSpotlightColor,
      }}
      {...props}
    >
      {/* Outer border glow layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg transition-opacity duration-300"
        style={{
          opacity: 'var(--opacity)',
          background: 'radial-gradient(150px circle at var(--mouse-x) var(--mouse-y), var(--border-spotlight-color), transparent 80%)',
        }}
      />
      
      {/* Card content container with base background */}
      <div className={`relative z-10 h-full w-full rounded-[7px] bg-panel/90 p-6 ${className}`.trim()}>
        {/* Inner background highlight */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[7px] transition-opacity duration-300"
          style={{
            opacity: 'var(--opacity)',
            background: 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)',
          }}
        />
        {children}
      </div>
    </div>
  )
}
