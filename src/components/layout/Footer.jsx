import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-line text-sm text-muted">
      <Container className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p>Futuristic Backend Lab Portfolio CMS</p>
        <p>Premium public layout shell</p>
      </Container>
    </footer>
  )
}
