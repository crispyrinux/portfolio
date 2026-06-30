import Container from '../ui/Container'

export default function Footer() {
  const BUILD_YEAR = new Date().getFullYear()

  return (
    <footer className="text-muted/50 mt-24">
      <Container className="py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground/80">Hammam Muhammad Yazid</p>
            <p className="text-xs text-muted/50">
              Computer Science · Universitas Gadjah Mada · Backend Systems Engineer
            </p>
          </div>

          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
            © {BUILD_YEAR}
          </div>
        </div>
      </Container>
    </footer>
  )
}
