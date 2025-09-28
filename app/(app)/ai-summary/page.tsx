"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, BookOpen, TrendingUp, Target, Lightbulb, Loader2, AlertCircle } from "lucide-react"
import { getJournalEntries, type JournalEntry } from "@/lib/journal"
import { createClient } from "@/lib/supabase"

type SummaryData = {
  overallSummary: string
  keyThemes: string[]
  growthAreas: string[]
  challenges: string[]
  achievements: string[]
  recommendations: string[]
  moodTrend: "positive" | "neutral" | "negative" | "mixed"
  entryCount: number
}

export default function AISummaryPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<string>("30")
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingEntries, setLoadingEntries] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const journalEntries = await getJournalEntries(user.id)
      setEntries(journalEntries.slice(0, 50)) // Limit to recent 50 entries
    } catch (error) {
      console.error("Error loading entries:", error)
      setError("Failed to load journal entries")
    } finally {
      setLoadingEntries(false)
    }
  }

  const handleEntryToggle = (entryId: string) => {
    setSelectedEntries((prev) => (prev.includes(entryId) ? prev.filter((id) => id !== entryId) : [...prev, entryId]))
  }

  const handleSelectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([])
    } else {
      setSelectedEntries(entries.map((entry) => entry.id))
    }
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    // Auto-select entries based on date range
    const days = Number.parseInt(value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filteredEntries = entries.filter((entry) => new Date(entry.created_at) >= cutoffDate)
    setSelectedEntries(filteredEntries.map((entry) => entry.id))
  }

  const generateSummary = async () => {
    if (selectedEntries.length === 0) {
      setError("Please select at least one entry to analyze")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryIds: selectedEntries,
          dateRange:
            dateRange !== "custom"
              ? {
                  startDate: new Date(Date.now() - Number.parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString(),
                  endDate: new Date().toISOString(),
                }
              : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setSummary(data.summary)
    } catch (error) {
      console.error("Error generating summary:", error)
      setError(error instanceof Error ? error.message : "Failed to generate AI summary")
    } finally {
      setLoading(false)
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "mixed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loadingEntries) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">AI Summary Generator</h1>
        <p className="text-muted-foreground text-pretty">
          Generate AI-powered insights and summaries from your journal entries to track your growth and identify
          patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Selection Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Entries
            </CardTitle>
            <CardDescription>Choose journal entries to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Range Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Entries ({selectedEntries.length} selected)</label>
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  {selectedEntries.length === entries.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-2 p-2 hover:bg-muted/50 rounded">
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => handleEntryToggle(entry.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(entry.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No journal entries found. Create some entries first!
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button className="w-full" onClick={generateSummary} disabled={loading || selectedEntries.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Summary Display */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {summary ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">AI Analysis Results</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{summary.entryCount} entries analyzed</Badge>
                    <Badge className={getMoodColor(summary.moodTrend)}>{summary.moodTrend} mood</Badge>
                  </div>
                </div>

                {/* Overall Summary */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Overall Summary
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{summary.overallSummary}</p>
                </div>

                {/* Key Themes */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Key Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyThemes.map((theme, index) => (
                      <Badge key={index} variant="secondary">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Growth Areas */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Growth Areas
                  </h3>
                  <ul className="space-y-1">
                    {summary.growthAreas.map((area, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                    <Target className="h-4 w-4" />
                    Achievements
                  </h3>
                  <ul className="space-y-1">
                    {summary.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    Challenges
                  </h3>
                  <ul className="space-y-1">
                    {summary.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-purple-600">
                    <Lightbulb className="h-4 w-4" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {summary.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Summary Generated</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select your journal entries and click "Generate AI Summary" to get AI-powered insights and analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
