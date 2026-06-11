import AdminLayout from '../components/admin/AdminLayout'

export default function ProjectForm({ mode }) {
  const title = mode === 'edit' ? 'Edit Project' : 'New Project'

  return (
    <AdminLayout
      title={title}
      description="A protected placeholder for the future project form."
    >
      <section className="border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm leading-7 text-slate-400">Project Form Placeholder</p>
      </section>
    </AdminLayout>
  )
}
