import { createClient } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  plan: "free" | "pro"
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  profile?: Profile
}

export async function signIn(email: string, password: string) {
  console.log("[v0] signIn called with email:", email)

  const supabase = createClient()
  console.log("[v0] Supabase client created:", !!supabase)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("[v0] signInWithPassword result:", { data: !!data, error: error?.message })

  if (error) {
    console.log("[v0] signIn error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function signUp(name: string, email: string, password: string) {
  console.log("[v0] signUp called with:", { name, email })

  const supabase = createClient()
  console.log("[v0] Supabase client created:", !!supabase)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
      data: {
        name,
      },
    },
  })

  console.log("[v0] signUp result:", { data: !!data, error: error?.message })

  if (error) {
    console.log("[v0] signUp error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    ...user,
    profile,
  }
}

export async function getSession() {
  const supabase = createClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return session
}

export async function resetPassword(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}
