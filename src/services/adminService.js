import { isSupabaseConfigured, supabase } from '../lib/supabase'

function isSupabaseReady() {
  return isSupabaseConfigured && Boolean(supabase)
}

export async function getCurrentSession() {
  if (!isSupabaseReady()) {
    return null
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data?.session) {
      return null
    }

    return data.session
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  if (!isSupabaseReady()) {
    return null
  }

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return data.user
  } catch {
    return null
  }
}

export async function isCurrentUserAdmin() {
  if (!isSupabaseReady()) {
    return false
  }

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return false
    }

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (error || !data) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function signOutAdmin() {
  if (!isSupabaseReady()) {
    return false
  }

  try {
    const { error } = await supabase.auth.signOut()
    return !error
  } catch {
    return false
  }
}
