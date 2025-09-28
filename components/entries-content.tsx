"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, Calendar, Tag, MoreVertical, Edit, Trash2, BookOpen, Clock } from "lucide-react"
import { getJournalEntries, deleteJournalEntry, getCategories } from "@/lib/journal"
import { useRouter } from "next/navigation"

interface JournalEntry {
  id: string
  title: string
  content: string
  category: {
    id: string
    name: string
    color: string
  } | null
  tags: string[]
  word_count: number
  reading_time: number
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  color: string
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
  { value: "category", label: "Category" },
]

export function EntriesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [entriesData, categoriesData] = await Promise.all([getJournalEntries(), getCategories()])
        setEntries(entriesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteJournalEntry(entryId)
        setEntries(entries.filter((entry) => entry.id !== entryId))
      } catch (error) {
        console.error("Error deleting entry:", error)
      }
    }
  }

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || entry.category?.name === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return (a.category?.name || "").localeCompare(b.category?.name || "")
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: Category | null) => {
    if (!category) return "bg-gray-500/10 text-gray-500 border-gray-500/20"

    // Convert hex color to Tailwind classes
    const colorMap: Record<string, string> = {
      "#3b82f6": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "#ef4444": "bg-red-500/10 text-red-500 border-red-500/20",
      "#22c55e": "bg-green-500/10 text-green-500 border-green-500/20",
      "#8b5cf6": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "#f97316": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "#06b6d4": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      "#ec4899": "bg-pink-500/10 text-pink-500 border-pink-500/20",
      "#84cc16": "bg-lime-500/10 text-lime-500 border-lime-500/20",
    }

    return colorMap[category.color] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  if (isLoading) {
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journal Entries</h1>
            <p className="text-muted-foreground">Manage and explore your development journey</p>
          </div>
          <Link href="/entries/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries, tags, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredEntries.length} of {entries.length} entries
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span>{filteredEntries.reduce((acc, entry) => acc + entry.word_count, 0).toLocaleString()} total words</span>
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      <Link href={`/entries/${entry.id}`} className="hover:text-primary transition-colors">
                        {entry.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      {entry.category && (
                        <Badge variant="outline" className={getCategoryColor(entry.category)}>
                          {entry.category.name}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(entry.created_at)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/entries/${entry.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEntry(entry.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-3 mb-4">{entry.content}</CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="mr-1 h-2 w-2" />
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{entry.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {entry.word_count} words
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No entries found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "Start documenting your developer journey by creating your first entry."}
              </p>
              <Link href="/entries/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
