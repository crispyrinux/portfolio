import AdminLayout from '../components/admin/AdminLayout'

export default function Archive() {
  return (
    <AdminLayout
      title="Archive"
      description="A protected placeholder for archived project management."
    >
      <section className="border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm leading-7 text-slate-400">Archive Placeholder</p>
      </section>
    </AdminLayout>
  )
}
