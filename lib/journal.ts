import { createClient } from "./supabase"

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  category_id?: string
  category?: {
    id: string
    name: string
    color: string
  }
  tags: string[]
  word_count: number
  reading_time: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  created_at: string
}

export async function getJournalEntries(userId?: string): Promise<JournalEntry[]> {
  const supabase = createClient()

  let query = supabase
    .from("journal_entries")
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .order("created_at", { ascending: false })

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getJournalEntry(id: string): Promise<JournalEntry | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("journal_entries")
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // Entry not found
    }
    throw new Error(error.message)
  }

  return data
}

export async function createJournalEntry(
  entry: Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<JournalEntry> {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // Calculate word count and reading time
  const wordCount = entry.content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const entryWithUser = {
    ...entry,
    user_id: user.id, // Set user_id for RLS policy
    word_count: wordCount,
    reading_time: readingTime,
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert([entryWithUser])
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .single()

  if (error) {
    console.error("[v0] Supabase insert error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("journal_entries")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("journal_entries").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getJournalStats(userId: string) {
  const supabase = createClient()

  // Get total entries
  const { count: totalEntries } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get this week's entries
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count: weekEntries } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", oneWeekAgo.toISOString())

  // Get entries for the last 7 days for chart
  const { data: weeklyData } = await supabase
    .from("journal_entries")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", oneWeekAgo.toISOString())
    .order("created_at")

  // Process weekly data for chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const weeklyChart = days.map((day) => ({ day, entries: 0 }))

  weeklyData?.forEach((entry) => {
    const dayIndex = new Date(entry.created_at).getDay()
    weeklyChart[dayIndex].entries++
  })

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: monthlyData } = await supabase
    .from("journal_entries")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at")

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyChart: { month: string; entries: number }[] = []

  // Create array for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = monthNames[date.getMonth()]
    monthlyChart.push({ month: monthName, entries: 0 })
  }

  // Count entries per month
  monthlyData?.forEach((entry) => {
    const entryDate = new Date(entry.created_at)
    const monthName = monthNames[entryDate.getMonth()]
    const monthEntry = monthlyChart.find((m) => m.month === monthName)
    if (monthEntry) {
      monthEntry.entries++
    }
  })

  return {
    totalEntries: totalEntries || 0,
    weekEntries: weekEntries || 0,
    weeklyChart,
    monthlyChart, // Added monthly chart data to return object
  }
}
