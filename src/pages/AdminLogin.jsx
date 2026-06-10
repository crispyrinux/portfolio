import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [session, setSession] = useState(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setIsSessionLoading(false)
        }
        return
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (!isMounted) {
          return
        }

        if (sessionError) {
          setError(sessionError.message)
        }

        setSession(data.session ?? null)
      } catch (thrownError) {
        if (isMounted) {
          setError(thrownError instanceof Error ? thrownError.message : 'Unable to read the current session.')
        }
      } finally {
        if (isMounted) {
          setIsSessionLoading(false)
        }
      }
    }

    loadSession()

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        isMounted = false
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession ?? null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleGithubLogin() {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured.')
      return
    }

    setError(null)
    setIsSigningIn(true)

    try {
      const redirectTo = `${window.location.origin}/admin/dashboard`
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
        },
      })

      if (signInError) {
        setError(signInError.message)
      }
    } catch (thrownError) {
      setError(thrownError instanceof Error ? thrownError.message : 'GitHub sign-in failed.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const isConfigured = isSupabaseConfigured && Boolean(supabase)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 py-12 text-slate-100">
      <section className="w-full max-w-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-[0_0_0_1px_rgba(124,140,255,0.04),0_30px_80px_rgba(0,0,0,0.45)] sm:p-10">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Admin</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Authorized Access Only</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              This hidden route is for the future admin workspace. Public visitors should only use the portfolio site.
            </p>
          </div>

          <div className="border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Access Status</p>

            {isSessionLoading ? (
              <p className="mt-3 text-sm text-slate-400">Checking your session...</p>
            ) : session?.user ? (
              <div className="mt-3 space-y-4">
                <p className="text-sm text-slate-300">
                  Signed in as <span className="text-white">{session.user.email ?? 'GitHub user'}</span>.
                </p>
                <p className="text-sm leading-7 text-slate-400">
                  Authentication is complete, but admin access will still be verified later with the whitelist and
                  protected route.
                </p>
                <Link
                  className="inline-flex items-center justify-center border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15"
                  to="/admin/dashboard"
                >
                  Continue to Dashboard
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                You are not signed in yet. Use GitHub to continue with the hidden admin entry.
              </p>
            )}
          </div>

          {error ? (
            <div className="border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
          ) : null}

          {!isConfigured ? (
            <div className="border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              Supabase is not configured.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center border border-slate-700 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleGithubLogin}
              disabled={!isConfigured || isSigningIn}
              type="button"
            >
              {isSigningIn ? 'Connecting...' : 'Continue with GitHub'}
            </button>

            <p className="text-sm leading-6 text-slate-500">
              GitHub sign-in will redirect to <span className="text-slate-300">/admin/dashboard</span>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
