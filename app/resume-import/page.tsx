"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, Sparkles, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExtractedData {
  name: string
  title: string
  summary: string
  experience: Array<{
    company: string
    role: string
    duration: string
    description: string
  }>
  skills: string[]
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
  }>
}

export default function ResumeImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      if (uploadedFile.type === "application/pdf" || uploadedFile.name.endsWith(".pdf")) {
        setFile(uploadedFile)
        toast({
          title: "File uploaded",
          description: "Resume uploaded successfully. Click 'Process Resume' to extract information.",
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const processResume = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const progressSteps = [
      { step: 20, message: "Reading PDF content..." },
      { step: 40, message: "Extracting text..." },
      { step: 60, message: "Analyzing structure..." },
      { step: 80, message: "Identifying sections..." },
      { step: 100, message: "Processing complete!" },
    ]

    for (const { step, message } of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProgress(step)
      toast({
        title: "Processing",
        description: message,
      })
    }

    // Mock extracted data
    const mockData: ExtractedData = {
      name: "Alex Johnson",
      title: "Senior Full Stack Developer",
      summary:
        "Experienced developer with 5+ years in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.",
      experience: [
        {
          company: "TechCorp Inc.",
          role: "Senior Full Stack Developer",
          duration: "2022 - Present",
          description:
            "Led development of microservices architecture, improved system performance by 40%, mentored 3 junior developers.",
        },
        {
          company: "StartupXYZ",
          role: "Full Stack Developer",
          duration: "2020 - 2022",
          description:
            "Built customer-facing web applications using React and Node.js, implemented CI/CD pipelines, worked in agile environment.",
        },
      ],
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL", "GraphQL", "Python", "Git", "Agile"],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Computer Science",
          year: "2020",
        },
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL",
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        },
        {
          name: "Task Management App",
          description: "Developed a collaborative task management application with real-time updates",
          technologies: ["React", "Socket.io", "MongoDB", "Express"],
        },
      ],
    }

    setExtractedData(mockData)
    setIsProcessing(false)

    toast({
      title: "Resume processed successfully!",
      description: "Review the extracted information and select sections to import.",
    })
  }

  const toggleSection = (section: string) => {
    setSelectedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const generateJournalEntries = () => {
    if (!extractedData || selectedSections.length === 0) return

    const entries = []

    if (selectedSections.includes("experience")) {
      extractedData.experience.forEach((exp) => {
        entries.push({
          title: `Experience at ${exp.company}`,
          content: `Role: ${exp.role}\nDuration: ${exp.duration}\n\n${exp.description}`,
          category: "Career",
          tags: ["experience", "career", exp.company.toLowerCase().replace(/\s+/g, "-")],
        })
      })
    }

    if (selectedSections.includes("projects")) {
      extractedData.projects.forEach((project) => {
        entries.push({
          title: `Project: ${project.name}`,
          content: `${project.description}\n\nTechnologies used: ${project.technologies.join(", ")}`,
          category: "Projects",
          tags: ["project", ...project.technologies.map((tech) => tech.toLowerCase())],
        })
      })
    }

    if (selectedSections.includes("skills")) {
      entries.push({
        title: "Technical Skills Overview",
        content: `My current technical skill set includes:\n\n${extractedData.skills.map((skill) => `• ${skill}`).join("\n")}\n\nThese skills have been developed through various projects and professional experiences.`,
        category: "Skills",
        tags: ["skills", "technical", ...extractedData.skills.slice(0, 5).map((skill) => skill.toLowerCase())],
      })
    }

    // Store entries in localStorage (in a real app, this would be saved to a database)
    const existingEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
    const newEntries = entries.map((entry) => ({
      ...entry,
      id: Date.now() + Math.random(),
      date: new Date().toISOString(),
      wordCount: entry.content.split(" ").length,
      readingTime: Math.ceil(entry.content.split(" ").length / 200),
    }))

    localStorage.setItem("journalEntries", JSON.stringify([...existingEntries, ...newEntries]))

    toast({
      title: "Journal entries created!",
      description: `Successfully created ${entries.length} journal entries from your resume.`,
    })

    // Reset state
    setExtractedData(null)
    setSelectedSections([])
    setFile(null)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Resume Import</h1>
        <p className="text-muted-foreground text-pretty">
          Upload your resume to automatically extract and convert your experience into journal entries.
        </p>
      </div>

      {!extractedData ? (
        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Resume
              </CardTitle>
              <CardDescription>Upload your resume in PDF format to extract information automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-upload">Resume File (PDF)</Label>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-sm font-medium">Processing resume...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button onClick={processResume} disabled={!file || isProcessing} className="w-full">
                {isProcessing ? "Processing..." : "Process Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload your resume</h4>
                    <p className="text-sm text-muted-foreground">Upload a PDF version of your resume</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI extracts information</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes and extracts key information from your resume
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Review and select</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose which sections to convert into journal entries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Generate entries</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically create structured journal entries from your experience
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Extracted Data Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Extracted Information
              </CardTitle>
              <CardDescription>
                Review the information extracted from your resume and select sections to import.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">{extractedData.name}</h3>
                <p className="text-primary font-medium">{extractedData.title}</p>
                <p className="text-sm text-muted-foreground mt-2">{extractedData.summary}</p>
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="experience"
                    checked={selectedSections.includes("experience")}
                    onChange={() => toggleSection("experience")}
                    className="rounded"
                  />
                  <Label htmlFor="experience" className="font-medium">
                    Work Experience ({extractedData.experience.length} entries)
                  </Label>
                </div>
                {selectedSections.includes("experience") && (
                  <div className="ml-6 space-y-3">
                    {extractedData.experience.map((exp, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">
                          {exp.role} at {exp.company}
                        </h4>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="projects"
                    checked={selectedSections.includes("projects")}
                    onChange={() => toggleSection("projects")}
                    className="rounded"
                  />
                  <Label htmlFor="projects" className="font-medium">
                    Projects ({extractedData.projects.length} entries)
                  </Label>
                </div>
                {selectedSections.includes("projects") && (
                  <div className="ml-6 space-y-3">
                    {extractedData.projects.map((project, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="skills"
                    checked={selectedSections.includes("skills")}
                    onChange={() => toggleSection("skills")}
                    className="rounded"
                  />
                  <Label htmlFor="skills" className="font-medium">
                    Technical Skills ({extractedData.skills.length} skills)
                  </Label>
                </div>
                {selectedSections.includes("skills") && (
                  <div className="ml-6">
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={generateJournalEntries} disabled={selectedSections.length === 0} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Journal Entries ({selectedSections.length} sections)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setExtractedData(null)
                    setSelectedSections([])
                    setFile(null)
                  }}
                >
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
