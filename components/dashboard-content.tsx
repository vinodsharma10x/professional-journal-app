"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"
import Link from "next/link"
import { BookOpen, TrendingUp, Target, Calendar, Plus, ArrowRight, Clock, Tag, Sparkles, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { getJournalEntries, getJournalStats, type JournalEntry } from "@/lib/journal"
import { useEffect, useState } from "react"
import { ContributionHeatmap } from "@/components/contribution-heatmap"

export function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState({
    totalEntries: 0,
    weekEntries: 0,
    weeklyChart: [] as { day: string; entries: number }[],
    monthlyChart: [] as { month: string; entries: number }[], // Added monthlyChart to stats state
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        // Load recent entries
        const entries = await getJournalEntries(user.id)
        setRecentEntries(entries.slice(0, 4)) // Get latest 4 entries

        // Load stats
        const journalStats = await getJournalStats(user.id)
        setStats(journalStats)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.user_metadata?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your developer journey.</p>
          </div>
          <Link href="/entries/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+{stats.weekEntries}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weekEntries}</div>
              <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+8</span> new insights
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Heatmap */}
        {user && <ContributionHeatmap userId={user.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Weekly Activity</span>
              </CardTitle>
              <CardDescription>Your journal entries over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  entries: {
                    label: "Entries",
                    color: "hsl(142 76% 36%)", // Using a bright green color for better contrast
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyChart}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="entries" fill="var(--color-entries)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Monthly Trends</span>
              </CardTitle>
              <CardDescription>Your journal entries over the past 6 months</CardDescription>{" "}
              {/* Updated description to reflect real data */}
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  entries: {
                    label: "Entries",
                    color: "hsl(142 76% 36%)", // Using bright green for better visibility
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyChart}>
                    {" "}
                    {/* Using real monthly data from stats */}
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="var(--color-entries)"
                      strokeWidth={3} // Increased stroke width for better visibility
                      dot={{ r: 5, fill: "var(--color-entries)" }} // Larger dots with proper fill
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Entries */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Recent Entries</span>
                </CardTitle>
                <CardDescription>Your latest journal entries</CardDescription>
              </div>
              <Link href="/entries">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries.length > 0 ? (
                recentEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-lg border border-border/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-medium text-foreground truncate">{entry.title}</h3>
                        {entry.category && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {entry.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(entry.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{entry.tags.slice(0, 2).join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No entries yet. Start your journey!</p>
                  <Link href="/entries/new">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Entry
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Goals</span>
              </CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/entries/new">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                  <Plus className="h-6 w-6 text-primary" />
                  <span className="text-sm">New Entry</span>
                </Button>
              </Link>
              <Link href="/ai-summary">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                  <Sparkles className="h-6 w-6 text-accent" />
                  <span className="text-sm">AI Summary</span>
                </Button>
              </Link>
              <Link href="/resume">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="text-sm">Import Resume</span>
                </Button>
              </Link>
              <Link href="/entries?filter=recent">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-sm">Browse Entries</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const goals = [
  { name: "Write 20 entries this month", progress: 65, current: 13, target: 20 },
  { name: "Learn 3 new technologies", progress: 33, current: 1, target: 3 },
  { name: "Complete React certification", progress: 80, current: 8, target: 10 },
]
