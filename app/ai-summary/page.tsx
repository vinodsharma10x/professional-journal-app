"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Brain, TrendingUp, Target, BookOpen, Copy, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SummaryResult {
  type: string
  title: string
  content: string
  insights: string[]
  recommendations: string[]
}

export default function AISummaryPage() {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [summaryType, setSummaryType] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const { toast } = useToast()

  // Mock journal entries (in a real app, this would come from the database)
  const journalEntries = [
    {
      id: "1",
      title: "Learning React Hooks",
      date: "2024-01-15",
      category: "Learning",
      tags: ["react", "hooks", "frontend"],
      wordCount: 450,
      preview: "Today I dove deep into React Hooks, particularly useState and useEffect...",
    },
    {
      id: "2",
      title: "Project: E-commerce Platform",
      date: "2024-01-10",
      category: "Projects",
      tags: ["project", "ecommerce", "fullstack"],
      wordCount: 680,
      preview: "Started working on a new e-commerce platform using Next.js and Stripe...",
    },
    {
      id: "3",
      title: "Team Leadership Reflection",
      date: "2024-01-08",
      category: "Career",
      tags: ["leadership", "team", "growth"],
      wordCount: 320,
      preview: "Reflecting on my experience leading the new feature development team...",
    },
    {
      id: "4",
      title: "Docker Containerization",
      date: "2024-01-05",
      category: "Learning",
      tags: ["docker", "devops", "containers"],
      wordCount: 520,
      preview: "Learning about Docker containerization and how it improves deployment...",
    },
    {
      id: "5",
      title: "Code Review Best Practices",
      date: "2024-01-03",
      category: "Skills",
      tags: ["code-review", "best-practices", "collaboration"],
      wordCount: 380,
      preview: "Documenting the code review process improvements we implemented...",
    },
  ]

  const summaryTypes = [
    { value: "weekly", label: "Weekly Summary", description: "Summarize your week's learning and progress" },
    { value: "monthly", label: "Monthly Review", description: "Comprehensive monthly progress analysis" },
    { value: "skills", label: "Skills Analysis", description: "Analyze your skill development and gaps" },
    { value: "projects", label: "Project Insights", description: "Extract insights from your project work" },
    { value: "growth", label: "Growth Tracking", description: "Track your professional growth journey" },
    { value: "custom", label: "Custom Analysis", description: "Generate summary based on your specific prompt" },
  ]

  const toggleEntry = (entryId: string) => {
    setSelectedEntries((prev) => (prev.includes(entryId) ? prev.filter((id) => id !== entryId) : [...prev, entryId]))
  }

  const selectAllEntries = () => {
    setSelectedEntries(journalEntries.map((entry) => entry.id))
  }

  const clearSelection = () => {
    setSelectedEntries([])
  }

  const generateSummary = async () => {
    if (selectedEntries.length === 0 || !summaryType) {
      toast({
        title: "Missing selection",
        description: "Please select entries and a summary type.",
        variant: "destructive",
      })
      return
    }

    if (summaryType === "custom" && !customPrompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please provide a custom prompt for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)

    // Simulate AI processing with progress updates
    const progressSteps = [
      { step: 20, message: "Analyzing selected entries..." },
      { step: 40, message: "Extracting key themes..." },
      { step: 60, message: "Generating insights..." },
      { step: 80, message: "Creating recommendations..." },
      { step: 100, message: "Summary complete!" },
    ]

    for (const { step, message } of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(step)
      toast({
        title: "Generating",
        description: message,
      })
    }

    // Mock AI-generated summary based on type
    const mockSummaries: Record<string, SummaryResult> = {
      weekly: {
        type: "Weekly Summary",
        title: "Week of January 8-15, 2024",
        content:
          "This week has been focused on expanding your technical skills and leadership capabilities. You've made significant progress in React development, particularly with hooks, while also taking on more responsibility in team leadership. Your learning approach shows a good balance between hands-on coding and strategic thinking.\n\nKey achievements include mastering React Hooks concepts, initiating a new e-commerce project, and reflecting on leadership experiences. The combination of technical learning and soft skill development indicates strong professional growth.",
        insights: [
          "Strong focus on modern React patterns and best practices",
          "Balanced approach between technical skills and leadership development",
          "Consistent documentation of learning experiences",
          "Active engagement in both individual and team-based work",
        ],
        recommendations: [
          "Continue the React learning path with advanced patterns like Context API",
          "Document specific leadership challenges and solutions for future reference",
          "Consider setting up a learning schedule to maintain consistency",
          "Share your React learnings with team members through knowledge sharing sessions",
        ],
      },
      skills: {
        type: "Skills Analysis",
        title: "Technical Skills Development Overview",
        content:
          "Your skill development shows a strong foundation in modern web development with particular strength in React ecosystem. You're actively learning DevOps practices with Docker, which complements your frontend expertise well. Your approach to code quality through reviews and best practices demonstrates professional maturity.\n\nThe combination of frontend development, containerization, and team collaboration skills positions you well for senior developer roles. Your learning pattern shows consistent engagement with both technical and process improvements.",
        insights: [
          "Strong React and frontend development capabilities",
          "Growing DevOps knowledge with Docker containerization",
          "Emphasis on code quality and review processes",
          "Leadership and team collaboration skills developing",
        ],
        recommendations: [
          "Deepen Docker knowledge with orchestration tools like Kubernetes",
          "Explore backend technologies to complement your fullstack skills",
          "Consider obtaining certifications in cloud platforms (AWS, Azure, GCP)",
          "Document your code review guidelines as a knowledge base for the team",
        ],
      },
      projects: {
        type: "Project Insights",
        title: "Project Work Analysis",
        content:
          "Your project work demonstrates a strong focus on practical application of skills. The e-commerce platform project shows ambition in tackling complex, real-world applications with modern technologies like Next.js and Stripe integration.\n\nYour approach to project documentation and reflection indicates good project management instincts. The choice of technologies (Next.js, Stripe) shows awareness of industry standards and best practices for production applications.",
        insights: [
          "Focus on production-ready, commercial applications",
          "Good technology selection aligned with industry standards",
          "Strong documentation and reflection practices",
          "Practical application of learning through real projects",
        ],
        recommendations: [
          "Consider implementing comprehensive testing for the e-commerce platform",
          "Document the architecture decisions and trade-offs made",
          "Plan for scalability and performance optimization from the start",
          "Create a deployment strategy using your Docker knowledge",
        ],
      },
    }

    const result = mockSummaries[summaryType] || mockSummaries.weekly
    setSummaryResult(result)
    setIsGenerating(false)

    toast({
      title: "Summary generated!",
      description: "Your AI-powered summary is ready for review.",
    })
  }

  const copySummary = () => {
    if (summaryResult) {
      navigator.clipboard.writeText(`${summaryResult.title}\n\n${summaryResult.content}`)
      toast({
        title: "Copied to clipboard",
        description: "Summary has been copied to your clipboard.",
      })
    }
  }

  const exportSummary = () => {
    if (summaryResult) {
      const content = `# ${summaryResult.title}\n\n${summaryResult.content}\n\n## Key Insights\n${summaryResult.insights.map((insight) => `• ${insight}`).join("\n")}\n\n## Recommendations\n${summaryResult.recommendations.map((rec) => `• ${rec}`).join("\n")}`

      const blob = new Blob([content], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${summaryResult.title.replace(/\s+/g, "-").toLowerCase()}-summary.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Summary exported",
        description: "Summary has been downloaded as a Markdown file.",
      })
    }
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
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Entry Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select Entries
              </CardTitle>
              <CardDescription>Choose journal entries to analyze ({selectedEntries.length} selected)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllEntries}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Checkbox
                      id={entry.id}
                      checked={selectedEntries.includes(entry.id)}
                      onCheckedChange={() => toggleEntry(entry.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor={entry.id} className="text-sm font-medium cursor-pointer">
                        {entry.title}
                      </label>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                      <p className="text-xs text-muted-foreground truncate">{entry.preview}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {entry.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.wordCount} words
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analysis Type
              </CardTitle>
              <CardDescription>Choose the type of summary to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={summaryType} onValueChange={setSummaryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select summary type" />
                </SelectTrigger>
                <SelectContent>
                  {summaryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {summaryType === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Prompt</label>
                  <Textarea
                    placeholder="Describe what you want to analyze or learn from your entries..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-sm font-medium">Generating summary...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={generateSummary}
                disabled={selectedEntries.length === 0 || !summaryType || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate AI Summary"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {summaryResult ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {summaryResult.title}
                    </CardTitle>
                    <CardDescription>
                      AI-generated analysis based on {selectedEntries.length} selected entries
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copySummary}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportSummary}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSummaryResult(null)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Content */}
                <div>
                  <h3 className="font-semibold mb-3">Summary</h3>
                  <div className="prose prose-sm max-w-none">
                    {summaryResult.content.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-3 text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {summaryResult.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {summaryResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Summary Generated</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select your journal entries and choose an analysis type to generate AI-powered insights and summaries.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
