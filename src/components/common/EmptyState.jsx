export default function EmptyState({ title, description, action, className = '' }) {
  return (
    <div
      className={`border border-line bg-panel/75 p-6 text-center shadow-panel sm:p-8 ${className}`.trim()}
    >
      <div className="mx-auto mb-5 h-12 w-12 border border-accent/40 bg-accent-soft" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
