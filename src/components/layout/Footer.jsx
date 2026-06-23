import Container from '../ui/Container'

// Simulated build metadata for engineering credibility
const BUILD_VERSION = 'v2.0.0-stable'
const COMMIT_HASH = '7c8cffa'
const BUILD_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-line text-muted">
      <Container className="py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Identity */}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-foreground/70">Hammam Muhammad Yazid</p>
            <p className="text-xs text-muted/60">
              Computer Science · Universitas Gadjah Mada · Backend Systems Engineer
            </p>
          </div>

          {/* Right: Engineering Credibility Metadata */}
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            {/* System Status */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
                System Active · open_for_contracts: true
              </span>
            </div>

            {/* Build info */}
            <p className="font-mono text-[11px] text-muted/40">
              Build {BUILD_VERSION} · commit {COMMIT_HASH} · © {BUILD_YEAR}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
