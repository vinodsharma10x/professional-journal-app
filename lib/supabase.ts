import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  console.log("[v0] Creating Supabase client with:", {
    url: !!SUPABASE_URL,
    key: !!SUPABASE_ANON_KEY,
    urlValue: SUPABASE_URL?.substring(0, 20) + "...",
    keyValue: SUPABASE_ANON_KEY?.substring(0, 20) + "...",
  })

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[v0] Missing Supabase environment variables:", {
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
    })
    throw new Error("Missing Supabase environment variables")
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

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
