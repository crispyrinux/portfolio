import { NavLink, useNavigate } from 'react-router-dom'
import { signOutAdmin } from '../../services/adminService'

const adminNavItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'New Project', to: '/admin/projects/new' },
  { label: 'Archive', to: '/admin/archive' },
]

function getNavLinkClass({ isActive }) {
  return [
    'border px-4 py-3 text-sm font-medium transition-colors',
    isActive
      ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100'
      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-100',
  ].join(' ')
}

export default function AdminLayout({ title, description, children }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOutAdmin()
    navigate('/admin', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-950/70 px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Admin</p>
              <h1 className="mt-3 text-xl font-semibold tracking-tight text-white">Portfolio CMS</h1>
            </div>

            <nav aria-label="Admin navigation" className="grid gap-3">
              {adminNavItems.map((item) => (
                <NavLink key={item.to} className={getNavLinkClass} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              className="w-full border border-slate-800 bg-slate-950/60 px-4 py-3 text-left text-sm font-medium text-slate-400 transition-colors hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-100"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Protected Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h2>
            {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{description}</p> : null}
          </div>

          {children}
        </section>
      </div>
    </main>
  )
}
