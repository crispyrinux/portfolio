export default function ErrorState({ title, message, action, className = '' }) {
  return (
    <div
      className={`border border-line bg-panel/75 p-6 text-center shadow-panel sm:p-8 ${className}`.trim()}
      role="alert"
    >
      <div className="mx-auto mb-5 h-12 w-12 border border-red-400/30 bg-red-400/10" aria-hidden="true" />
      {title ? <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2> : null}
      {message ? <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">{message}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
