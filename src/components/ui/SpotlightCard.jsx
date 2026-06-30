import React, { useRef } from 'react'

const SpotlightCard = React.memo(({
  children,
  className = '',
  containerClassName = '',
  spotlightColor = 'rgba(0, 85, 255, 0.02)',
  borderSpotlightColor = 'rgba(0, 85, 255, 0.2)',
  ...props
}) => {
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    container.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    container.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const handleMouseEnter = () => {
    const container = containerRef.current
    if (!container) return
    container.style.setProperty('--opacity', '1')
  }

  const handleMouseLeave = () => {
    const container = containerRef.current
    if (!container) return
    container.style.setProperty('--opacity', '0')
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-lg border border-line bg-panel/30 p-[1px] transition-all duration-300 hover:border-transparent ${containerClassName}`.trim()}
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px',
        '--opacity': '0',
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
})

SpotlightCard.displayName = 'SpotlightCard'

export default SpotlightCard
