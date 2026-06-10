export default function SectionHeader({ eyebrow, title, description, titleId, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.38em] text-muted">{eyebrow}</p>
      ) : null}
      <h2 id={titleId} className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p> : null}
    </div>
  )
}
