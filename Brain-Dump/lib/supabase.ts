import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // For deployment, provide fallback values to prevent build errors
  const url = supabaseUrl || "https://placeholder.supabase.co"
  const key = supabaseAnonKey || "placeholder-key"

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")

    // Return a mock client for development/preview builds
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signUp: () =>
          Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          eq: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
        }),
        upsert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
        update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      }),
    } as any
  }

  try {
    return createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return createSupabaseClient() // Return mock client
  }
}

// Create a singleton instance
export const supabase = createSupabaseClient()
