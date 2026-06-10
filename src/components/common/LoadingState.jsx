export default function LoadingState({ label, className = '' }) {
  return (
    <div className={`border border-line bg-panel/75 p-6 shadow-panel sm:p-8 ${className}`.trim()}>
      <div className="space-y-4" aria-hidden="true">
        <div className="h-3 w-24 bg-panelStrong" />
        <div className="h-5 w-3/4 bg-panelStrong" />
        <div className="h-3 w-full bg-panelStrong" />
        <div className="h-3 w-5/6 bg-panelStrong" />
      </div>
      {label ? <p className="mt-5 text-sm text-muted">{label}</p> : null}
    </div>
  )
}
