import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { getCurrentSession, getCurrentUser, isCurrentUserAdmin } from '../services/adminService'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [accessState, setAccessState] = useState('checking')

  useEffect(() => {
    let isMounted = true

    async function checkAccess() {
      try {
        const session = await getCurrentSession()

        if (!isMounted) {
          return
        }

        if (!session) {
          setAccessState('unauthenticated')
          return
        }

        const user = await getCurrentUser()

        if (!isMounted) {
          return
        }

        if (!user) {
          setAccessState('unauthenticated')
          return
        }

        const isAdmin = await isCurrentUserAdmin()

        if (isMounted) {
          setAccessState(isAdmin ? 'allowed' : 'denied')
        }
      } catch {
        if (isMounted) {
          setAccessState('denied')
        }
      }
    }

    checkAccess()

    return () => {
      isMounted = false
    }
  }, [])

  if (accessState === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 py-12 text-slate-100">
        <LoadingState label="Checking admin access..." className="w-full max-w-2xl" />
      </main>
    )
  }

  if (accessState === 'unauthenticated') {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />
  }

  if (accessState === 'denied') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 py-12 text-slate-100">
        <ErrorState
          title="Access Denied"
          message="This session is authenticated, but the user is not whitelisted in admin_profiles."
          className="w-full max-w-2xl"
        />
      </main>
    )
  }

  return children
}
