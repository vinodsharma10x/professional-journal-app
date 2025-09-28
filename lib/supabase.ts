import { createBrowserClient, createServerClient } from "@supabase/ssr"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export function createClient() {
  console.log("[DevJournal] Creating browser Supabase client")

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[DevJournal] Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Server-side Supabase client (should only be used in server components)
export async function createServerSupabaseClient() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[DevJournal] Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
