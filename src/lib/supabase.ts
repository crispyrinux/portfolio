import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  ""
).trim();

const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getCurrentSession() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session) return null;
    return data.session;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const user = await getCurrentUser();
    if (!user?.id) return false;

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}

export async function signOutAdmin(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch {
    return false;
  }
}
