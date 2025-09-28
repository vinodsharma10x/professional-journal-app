"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"
import Link from "next/link"
import { BookOpen, TrendingUp, Target, Calendar, Plus, ArrowRight, Clock, Tag, Sparkles, FileText } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

// Mock data for charts and recent entries
const weeklyData = [
  { day: "Mon", entries: 2 },
  { day: "Tue", entries: 1 },
  { day: "Wed", entries: 3 },
  { day: "Thu", entries: 2 },
  { day: "Fri", entries: 4 },
  { day: "Sat", entries: 1 },
  { day: "Sun", entries: 2 },
]

const monthlyData = [
  { month: "Jan", entries: 12, insights: 8 },
  { month: "Feb", entries: 18, insights: 12 },
  { month: "Mar", entries: 15, insights: 10 },
  { month: "Apr", entries: 22, insights: 15 },
  { month: "May", entries: 28, insights: 18 },
  { month: "Jun", entries: 25, insights: 16 },
]

const recentEntries = [
  {
    id: 1,
    title: "Learned React Server Components",
    category: "Learning",
    date: "2 hours ago",
    tags: ["React", "Next.js", "SSR"],
    excerpt: "Deep dive into RSCs and how they improve performance...",
  },
  {
    id: 2,
    title: "Debugging Production Issue",
    category: "Problem Solving",
    date: "1 day ago",
    tags: ["Debugging", "Production", "Performance"],
    excerpt: "Encountered a memory leak in our Node.js service...",
  },
  {
    id: 3,
    title: "Team Code Review Insights",
    category: "Collaboration",
    date: "2 days ago",
    tags: ["Code Review", "Team", "Best Practices"],
    excerpt: "Great discussion about error handling patterns...",
  },
  {
    id: 4,
    title: "TypeScript Advanced Types",
    category: "Learning",
    date: "3 days ago",
    tags: ["TypeScript", "Types", "Advanced"],
    excerpt: "Exploring conditional types and template literals...",
  },
]

const goals = [
  { name: "Write 20 entries this month", progress: 65, current: 13, target: 20 },
  { name: "Learn 3 new technologies", progress: 33, current: 1, target: 3 },
  { name: "Complete React certification", progress: 80, current: 8, target: 10 },
]

export function DashboardContent() {
  const user = getCurrentUser()

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}!</h1>
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
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+3</span> from last week
              </p>
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
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
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
              <CardDescription>Entries and AI insights over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  entries: {
                    label: "Entries",
                    color: "hsl(var(--primary))",
                  },
                  insights: {
                    label: "AI Insights",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="var(--color-entries)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="insights"
                      stroke="var(--color-insights)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
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
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-lg border border-border/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{entry.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{entry.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{entry.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{entry.tags.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
