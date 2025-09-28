import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code

  if (code) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      redirect("/dashboard")
    }
  }

  // Return the user to an error page with instructions
  redirect("/auth?error=Could not authenticate user")
}
