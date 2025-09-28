import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase"
import { getJournalEntries } from "@/lib/journal"

const summarySchema = z.object({
  overallSummary: z.string().describe("A comprehensive summary of the journal entries"),
  keyThemes: z.array(z.string()).describe("Main themes and topics identified across entries"),
  growthAreas: z.array(z.string()).describe("Areas where the person has shown growth or learning"),
  challenges: z.array(z.string()).describe("Common challenges or obstacles mentioned"),
  achievements: z.array(z.string()).describe("Notable achievements or milestones"),
  recommendations: z.array(z.string()).describe("Actionable recommendations for future development"),
  moodTrend: z.enum(["positive", "neutral", "negative", "mixed"]).describe("Overall mood trend across entries"),
  entryCount: z.number().describe("Number of entries analyzed"),
})

export async function POST(request: NextRequest) {
  try {
    const { entryIds, dateRange } = await request.json()

    // Get user from Supabase auth
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch journal entries
    let entries
    if (entryIds && entryIds.length > 0) {
      // Fetch specific entries by IDs
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .in("id", entryIds)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      entries = data
    } else {
      // Fetch entries based on date range or default to recent entries
      entries = await getJournalEntries(user.id)

      if (dateRange) {
        const { startDate, endDate } = dateRange
        entries = entries.filter((entry) => {
          const entryDate = new Date(entry.created_at)
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
        })
      } else {
        // Default to last 30 entries or last 30 days
        entries = entries.slice(0, 30)
      }
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No entries found to analyze" }, { status: 400 })
    }

    // Prepare content for AI analysis
    const entriesText = entries
      .map(
        (entry) =>
          `Title: ${entry.title}\nDate: ${entry.created_at}\nContent: ${entry.content}\nTags: ${entry.tags.join(", ")}\n---`,
      )
      .join("\n\n")

    console.log("[v0] Analyzing", entries.length, "journal entries for AI summary")

    // Generate AI summary using Claude
    const { object: summary } = await generateObject({
      model: "anthropic/claude-sonnet-4",
      schema: summarySchema,
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes personal journal entries to provide insightful summaries and recommendations. Focus on identifying patterns, growth, challenges, and actionable insights for personal and professional development.`,
        },
        {
          role: "user",
          content: `Please analyze these journal entries and provide a comprehensive summary with insights:

${entriesText}

Please provide:
1. An overall summary of the entries
2. Key themes and topics
3. Areas of growth and learning
4. Common challenges
5. Notable achievements
6. Actionable recommendations
7. Overall mood trend
8. Entry count analyzed`,
        },
      ],
    })

    console.log("[v0] AI summary generated successfully")

    return NextResponse.json({
      success: true,
      summary,
      analyzedEntries: entries.length,
      dateRange:
        entries.length > 0
          ? {
              start: entries[entries.length - 1].created_at,
              end: entries[0].created_at,
            }
          : null,
    })
  } catch (error) {
    console.error("[v0] AI summary generation failed:", error)
    return NextResponse.json(
      {
        error: "Failed to generate AI summary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
