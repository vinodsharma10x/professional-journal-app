"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Eye, Tag, X, Plus, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { getJournalEntry, createJournalEntry, updateJournalEntry, getCategories } from "@/lib/journal"

interface EntryEditorProps {
  entryId?: string
}

interface Category {
  id: string
  name: string
  color: string
}

const suggestedTags = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "JavaScript",
  "CSS",
  "HTML",
  "Database",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "DevOps",
  "Testing",
  "Debugging",
  "Performance",
  "Security",
  "API",
  "REST",
  "GraphQL",
  "Microservices",
  "Git",
  "Code Review",
  "Refactoring",
  "Architecture",
  "Learning",
  "Career",
  "Team",
  "Leadership",
  "Mentoring",
]

export function EntryEditor({ entryId }: EntryEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    tags: [] as string[],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        if (entryId && entryId !== "new") {
          const entryData = await getJournalEntry(entryId)
          if (entryData) {
            setFormData({
              title: entryData.title,
              content: entryData.content,
              category_id: entryData.category?.id || "",
              tags: entryData.tags || [],
            })
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [entryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const entryData = {
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id || null,
        tags: formData.tags,
      }

      if (entryId && entryId !== "new") {
        await updateJournalEntry(entryId, entryData)
      } else {
        await createJournalEntry(entryData)
      }

      router.push("/entries")
    } catch (error) {
      console.error("Error saving entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const wordCount = formData.content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  if (isLoadingData) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/entries">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Entries
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {entryId && entryId !== "new" ? "Edit Entry" : "New Entry"}
              </h1>
              <p className="text-sm text-muted-foreground">Document your development journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {!isPreview ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Write Your Entry</CardTitle>
                  <CardDescription>Share your thoughts, learnings, and experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="What did you learn or work on today?"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, code snippets, challenges, solutions, and reflections..."
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span>Tip: Use markdown formatting for code blocks and lists</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>{formData.title || "Untitled Entry"}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{wordCount} words</span>
                    </div>
                    {formData.category_id && (
                      <Badge variant="outline">{categories.find((c) => c.id === formData.category_id)?.name}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {formData.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph || "\u00A0"}
                      </p>
                    ))}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Selection */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Category</CardTitle>
                <CardDescription>Organize your entry</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tags</CardTitle>
                <CardDescription>Add relevant tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Suggested Tags */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Suggested Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags
                      .filter((tag) => !formData.tags.includes(tag))
                      .slice(0, 12)
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entry Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Entry Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Word count:</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Character count:</span>
                  <span className="font-medium">{formData.content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="font-medium">{formData.tags.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reading time:</span>
                  <span className="font-medium">{Math.max(1, Math.ceil(wordCount / 200))} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
