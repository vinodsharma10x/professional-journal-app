"use client"

import { useState } from "react"
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

// Mock data for journal entries
const mockEntries = [
  {
    id: 1,
    title: "Learned React Server Components",
    content:
      "Today I dove deep into React Server Components and how they work with Next.js 13+. The concept of running components on the server to reduce client-side JavaScript is fascinating...",
    category: "Learning",
    tags: ["React", "Next.js", "SSR", "Performance"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    wordCount: 450,
  },
  {
    id: 2,
    title: "Debugging Production Memory Leak",
    content:
      "Encountered a critical memory leak in our Node.js microservice that was causing the application to crash every few hours. Used heap dumps and profiling tools to identify the issue...",
    category: "Problem Solving",
    tags: ["Node.js", "Debugging", "Memory", "Production", "Performance"],
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T16:20:00Z",
    wordCount: 680,
  },
  {
    id: 3,
    title: "Team Code Review Best Practices",
    content:
      "Had an excellent discussion with the team about code review practices. We established new guidelines for constructive feedback and decided to implement automated checks...",
    category: "Collaboration",
    tags: ["Code Review", "Team", "Best Practices", "Process"],
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    wordCount: 320,
  },
  {
    id: 4,
    title: "TypeScript Advanced Types Deep Dive",
    content:
      "Exploring conditional types, template literal types, and mapped types in TypeScript. These advanced features are incredibly powerful for creating type-safe APIs...",
    category: "Learning",
    tags: ["TypeScript", "Types", "Advanced", "API Design"],
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
    wordCount: 520,
  },
  {
    id: 5,
    title: "Implementing OAuth 2.0 with PKCE",
    content:
      "Successfully implemented OAuth 2.0 with PKCE (Proof Key for Code Exchange) for our mobile application. The security implications and flow were more complex than expected...",
    category: "Implementation",
    tags: ["OAuth", "Security", "Mobile", "Authentication"],
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z",
    wordCount: 750,
  },
  {
    id: 6,
    title: "Database Query Optimization",
    content:
      "Spent the day optimizing slow database queries. Identified several N+1 query problems and implemented proper indexing strategies. Performance improved by 60%...",
    category: "Performance",
    tags: ["Database", "SQL", "Optimization", "Performance", "Indexing"],
    createdAt: "2024-01-10T16:45:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
    wordCount: 420,
  },
]

const categories = ["All", "Learning", "Problem Solving", "Collaboration", "Implementation", "Performance"]
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
  { value: "category", label: "Category" },
]

export function EntriesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [entries] = useState(mockEntries)

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Learning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Problem Solving": "bg-red-500/10 text-red-500 border-red-500/20",
      Collaboration: "bg-green-500/10 text-green-500 border-green-500/20",
      Implementation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Performance: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    }
    return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
          <span>{filteredEntries.reduce((acc, entry) => acc + entry.wordCount, 0).toLocaleString()} total words</span>
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
                      <Badge variant="outline" className={getCategoryColor(entry.category)}>
                        {entry.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(entry.createdAt)}
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
                      <DropdownMenuItem className="text-destructive">
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
                    {entry.wordCount} words
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
