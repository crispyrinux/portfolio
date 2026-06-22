import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-line text-sm text-muted">
      <Container className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p>Hammam Muhammad Yazid Portfolio</p>
        <p>Universitas Gadjah Mada · Computer Science</p>
      </Container>
    </footer>
  )
}
