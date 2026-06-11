import AdminLayout from '../components/admin/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="A protected placeholder for future CMS project management."
    >
      <section className="border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm leading-7 text-slate-400">Admin Dashboard Placeholder</p>
      </section>
    </AdminLayout>
  )
}
