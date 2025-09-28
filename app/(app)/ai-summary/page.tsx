"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen } from "lucide-react"

export default function AISummaryPage() {
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
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Entries
            </CardTitle>
            <CardDescription>Choose journal entries to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Generate AI Summary</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Summary Generated</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select your journal entries and choose an analysis type to generate AI-powered insights and summaries.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
