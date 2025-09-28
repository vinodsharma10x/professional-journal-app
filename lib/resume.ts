import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface ResumeData {
  id?: string
  user_id?: string
  filename: string
  file_size?: number
  raw_text: string
  parsed_data: {
    personal_info?: {
      name?: string
      title?: string
      email?: string
      phone?: string
    }
    experience?: Array<{
      title: string
      company: string
      start_date?: string
      end_date?: string
      description: string
    }>
    education?: Array<{
      degree: string
      institution: string
      start_date?: string
      end_date?: string
      details?: string
    }>
    projects?: Array<{
      name: string
      year?: string
      description: string
    }>
    skills?: string[]
  }
  created_at?: string
  updated_at?: string
}

export async function saveResume(resumeData: Omit<ResumeData, "id" | "user_id" | "created_at" | "updated_at">) {
  console.log("[v0] Saving resume to database:", resumeData.filename)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      filename: resumeData.filename,
      file_size: resumeData.file_size,
      raw_text: resumeData.raw_text,
      parsed_data: resumeData.parsed_data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Supabase resume insert error:", error)
    throw new Error(`Failed to save resume: ${error.message}`)
  }

  console.log("[v0] Resume saved successfully:", data.id)
  return data
}

export async function getResumes() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching resumes:", error)
    throw new Error(`Failed to fetch resumes: ${error.message}`)
  }

  return data
}
