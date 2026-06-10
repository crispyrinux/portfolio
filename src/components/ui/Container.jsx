export default function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 ${className}`.trim()}>
      {children}
    </div>
  )
}
