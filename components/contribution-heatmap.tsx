"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getJournalEntries } from "@/lib/journal"

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionHeatmapProps {
  userId: string
}

export function ContributionHeatmap({ userId }: ContributionHeatmapProps) {
  const [contributionData, setContributionData] = useState<ContributionDay[]>([])
  const [totalContributions, setTotalContributions] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    async function loadContributionData() {
      try {
        const entries = await getJournalEntries(userId)
        const years = new Set<number>()
        entries.forEach((entry) => {
          const year = new Date(entry.created_at).getFullYear()
          years.add(year)
        })
        const currentYear = new Date().getFullYear()
        years.add(currentYear)
        years.add(currentYear - 1)
        years.add(currentYear - 2)
        const sortedYears = Array.from(years).sort((a, b) => b - a)
        setAvailableYears(sortedYears)
        const data = processContributionData(entries, selectedYear)
        setContributionData(data)
        setTotalContributions(data.reduce((sum, day) => sum + day.count, 0))
      } catch (error) {
        console.error("Failed to load contribution data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContributionData()
  }, [userId, selectedYear])

  const processContributionData = (entries: any[], year: number): ContributionDay[] => {
    const dateMap = new Map<string, number>()

    entries.forEach((entry) => {
      const date = new Date(entry.created_at)
      if (date.getFullYear() === year) {
        const dateStr = date.toISOString().split("T")[0]
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
      }
    })

    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    const days: ContributionDay[] = []

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const count = dateMap.get(dateStr) || 0
      const level = getContributionLevel(count)

      days.push({
        date: dateStr,
        count,
        level,
      })
    }

    return days
  }

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count <= 2) return 2
    if (count <= 4) return 3
    return 4
  }

  const getContributionColor = (level: number): string => {
    const colors = [
      "bg-muted/30", // No contributions
      "bg-emerald-200 dark:bg-emerald-900/40", // 1 contribution
      "bg-emerald-300 dark:bg-emerald-800/60", // 2 contributions
      "bg-emerald-400 dark:bg-emerald-700/80", // 3-4 contributions
      "bg-emerald-500 dark:bg-emerald-600", // 5+ contributions
    ]
    return colors[level] || colors[0]
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  contributionData.forEach((day, index) => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()

    if (index === 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: "", count: 0, level: 0 })
      }
    }

    currentWeek.push(day)

    if (dayOfWeek === 6 || index === contributionData.length - 1) {
      if (index === contributionData.length - 1 && dayOfWeek !== 6) {
        for (let i = dayOfWeek + 1; i <= 6; i++) {
          currentWeek.push({ date: "", count: 0, level: 0 })
        }
      }
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Loading activity...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-medium">
            {totalContributions} journal entries in {selectedYear}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm bg-background border border-border rounded px-2 py-1"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex text-xs text-muted-foreground">
            <div className="w-8"></div>
            {months.map((month, index) => (
              <div key={month} className="flex-1 text-center min-w-0">
                {index % 2 === 0 ? month : ""}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground w-8">
              {weekdays.map((day, index) => (
                <div key={day} className="h-3 flex items-center">
                  {index % 2 === 1 ? day : ""}
                </div>
              ))}
            </div>

            <div className="flex gap-1 flex-1 overflow-x-auto">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm border border-border/50 ${
                        day.date ? getContributionColor(day.level) : "bg-transparent border-transparent"
                      }`}
                      title={day.date ? `${day.count} entries on ${new Date(day.date).toLocaleDateString()}` : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Learn how we count journal entries</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border border-border/50 ${getContributionColor(level)}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
