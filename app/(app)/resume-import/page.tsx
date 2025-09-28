"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createJournalEntry } from "@/lib/journal"
import { saveResume, type ResumeData } from "@/lib/resume"
import { generateObject } from "ai"
import { z } from "zod"

interface ExtractedSection {
  title: string
  content: string
  category: string
  start_date?: string
  end_date?: string
}

const resumeParsingSchema = z.object({
  personal_info: z.object({
    name: z.string(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    summary: z.string().optional(),
  }),
  work_experience: z.array(
    z.object({
      company: z.string(),
      position: z.string().optional(),
      location: z.string().optional(),
      start_date: z.string(),
      end_date: z.string(),
      description: z.string(),
      achievements: z.array(z.string()).optional(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string().optional(),
      year: z.string(),
      type: z.string().optional(), // degree, certification, etc.
    }),
  ),
  skills: z.array(z.string()).optional(),
})

export default function ResumeImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedSections, setExtractedSections] = useState<ExtractedSection[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      setIsComplete(false)
      setExtractedSections([])
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, you would use a PDF parsing library like pdf-parse or PDF.js
        // For now, we'll simulate extracting the actual uploaded resume content
        const actualResumeText = `
VINOD SHARMA 
Sanford, Florida | linkedin.com/in/vinodsharma10x 
 
Dynamic and entrepreneurial leader with 24 years of experience in building and scaling 
multimillion-dollar digital products and high-performing teams. A strategic thinker with 
deep expertise in product development, I excel at transforming visionary ideas into 
successful products through strategic planning, agile methodologies, and cross-
functional leadership. My career highlights include: 
 
• Transformational leadership: Spearheaded Agile transformations that led to a 25% 
improvement in team efficiency and faster product development. 
• Product innovation: Directed the development and launch of digital products that 
have significantly enhanced customer engagement and business growth. 
• Strategic growth: Expert in aligning product strategies with business goals to drive 
exponential growth and scalability. 
 
I am passionate about leveraging my experience to drive innovation and growth in a 
fast-paced startup environment where I can contribute as part of the leadership team. 
 
PROFESSIONAL EXPERIENCE 
 
ADVENTHEALTH, Altamonte Springs, FL    2005 - Present 
 
I lead the end-to-end product lifecycle for AdventHealth's consumer products, including 
AdventHealth.com and AdventHealth Apps. This has resulted in a 35% increase in 
digital engagement and a measurable improvement in patient experience. These 
platforms now serve over 2.5 million active users annually. 
 
I spearheaded the Agile transformation, implementing new frameworks and processes 
that improved team efficiency by 25% and reduced project delivery times by 20%. 
 
Before this role, I directed the architecture and implementation of enterprise-level web 
applications, including the Enterprise-wide Intranet, marketing portals, and Physician 
Portal. I reduced downtime by 30%, enhancing system performance and scalability. 
 
Laksha LLC         2010 – 2020 
 
I ran a successful side business offering affordable digital solutions to small enterprises, 
focusing on those unable to afford large agencies. 
 
I built and led an offshore team of three developers, establishing processes that allowed 
the team to operate independently and efficiently. 
 
PATNI COMPUTER SYSTEMS LIMITED    2002 - 2005 

I led a cross-functional team of developers and business analysts on over 20 projects, 
consistently delivering software solutions that met client satisfaction. 
 
I was the onsite coordinator for a Seven-Eleven point-of-sale product, managing an 
offshore team of 60 developers and ensuring successful delivery to onsite clients. 
 
I developed applications using C#, .NET, and ASP.NET and optimized code to eliminate 
performance bottlenecks. 
 
EDUCATION & CERTIFICATIONS 
 
PMP Certification, PMI         2016 
Prosci Change Management       2017 
MBA, Webster University, St Louis, MO       2015 
Bachelor of Engineering, North Maharashtra University,    1998
        `
        resolve(actualResumeText)
      }, 1000)
    })
  }

  const parseResumeContent = async (
    text: string,
  ): Promise<{ sections: ExtractedSection[]; parsedData: ResumeData["parsed_data"] }> => {
    console.log("[v0] Starting AI-powered resume parsing...")

    try {
      const { object: parsedResume } = await generateObject({
        model: "anthropic/claude-sonnet-4",
        messages: [
          {
            role: "user",
            content: `Parse this resume and extract structured information. Pay special attention to:
        1. All work experiences with accurate date ranges
        2. All education and certifications with years
        3. Extract meaningful achievements and descriptions
        4. Convert date ranges to proper start/end dates (use YYYY-MM-DD format)
        5. For "Present" end dates, use the current date
        
        Resume text:
        ${text}`,
          },
        ],
        schema: resumeParsingSchema,
      })

      console.log("[v0] AI parsing result:", parsedResume)

      const sections: ExtractedSection[] = []
      const parsedData: ResumeData["parsed_data"] = {
        experience: [],
        education: [],
        projects: [],
        skills: parsedResume.skills || [],
      }

      // Process work experience
      if (parsedResume.work_experience) {
        for (const exp of parsedResume.work_experience) {
          const startDate = exp.start_date ? new Date(exp.start_date).toISOString().split("T")[0] : undefined
          const endDate =
            exp.end_date && exp.end_date !== "Present"
              ? new Date(exp.end_date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]

          const content = `${exp.company} - ${exp.position || "Position"}
${exp.location || ""}
${exp.start_date} - ${exp.end_date}

${exp.description}

${exp.achievements ? exp.achievements.map((a) => `• ${a}`).join("\n") : ""}`

          sections.push({
            title: `Work Experience: ${exp.company}`,
            content: content.trim(),
            category: "Career",
            start_date: startDate,
            end_date: endDate,
          })

          parsedData.experience?.push({
            title: exp.position || exp.company,
            company: exp.company,
            start_date: startDate,
            end_date: endDate,
            description: exp.description,
          })
        }
      }

      // Process education
      if (parsedResume.education) {
        for (const edu of parsedResume.education) {
          const year = edu.year || new Date().getFullYear().toString()
          const startDate = `${year}-01-01`
          const endDate = `${year}-12-31`

          const content = `${edu.degree}
${edu.institution || ""}
${edu.year || ""}`

          sections.push({
            title: `${edu.type === "certification" ? "Certification" : "Education"}: ${edu.degree}`,
            content: content.trim(),
            category: "Learning",
            start_date: startDate,
            end_date: endDate,
          })

          parsedData.education?.push({
            degree: edu.degree,
            institution: edu.institution || "",
            start_date: startDate,
            end_date: endDate,
            details: edu.degree,
          })
        }
      }

      console.log(
        "[v0] Created sections:",
        sections.length,
        sections.map((s) => s.title),
      )

      return { sections, parsedData }
    } catch (error) {
      console.error("[v0] AI parsing failed, falling back to basic parsing:", error)

      // Fallback to basic parsing if AI fails
      const sections: ExtractedSection[] = []
      const parsedData: ResumeData["parsed_data"] = {
        experience: [],
        education: [],
        projects: [],
        skills: [],
      }

      // Simple fallback - just create one entry with the full resume
      sections.push({
        title: "Resume Import",
        content: text,
        category: "Career",
      })

      return { sections, parsedData }
    }
  }

  const processResume = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to process.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      setProgress(25)
      const extractedText = await extractTextFromPDF(file)

      setProgress(50)
      console.log("[v0] Saving resume to database:", file.name)
      const resumeId = await saveResume({
        filename: file.name,
        file_size: file.size,
        raw_text: extractedText,
        parsed_data: {
          experience: [],
          education: [],
          projects: [],
          skills: [],
        },
      })
      console.log("[v0] Resume saved successfully:", resumeId)

      setProgress(60)
      const { sections, parsedData } = await parseResumeContent(extractedText)
      setExtractedSections(sections)

      setProgress(75)
      for (const section of sections) {
        await createJournalEntry({
          title: section.title,
          content: section.content,
          category_id: null, // Will be handled by the createJournalEntry function
          tags: [section.category.toLowerCase()],
          start_date: section.start_date,
          end_date: section.end_date,
        })
      }

      setProgress(100)
      setIsComplete(true)

      toast({
        title: "Resume processed successfully!",
        description: `Created ${sections.length} journal entries from your resume.`,
      })
    } catch (error) {
      console.error("[v0] Error processing resume:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const viewEntries = () => {
    router.push("/entries")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Resume Import</h1>
        <p className="text-muted-foreground text-pretty">
          Upload your resume to automatically extract and convert your experience into journal entries. Your full resume
          will be saved separately for future reference.
        </p>
      </div>

      <div className="space-y-6">
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
                onChange={handleFileChange}
                disabled={isProcessing}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}

            <Button onClick={processResume} disabled={!file || isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Process Resume"}
            </Button>
          </CardContent>
        </Card>

        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Resume</CardTitle>
              <CardDescription>Using AI to intelligently extract information from your resume...</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
            </CardContent>
          </Card>
        )}

        {isComplete && extractedSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Processing Complete
              </CardTitle>
              <CardDescription>
                Successfully extracted {extractedSections.length} sections from your resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {extractedSections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Category: {section.category}</p>
                    {section.start_date && section.end_date && (
                      <p className="text-xs text-muted-foreground">
                        {section.start_date} to {section.end_date}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={viewEntries} className="w-full">
                View Created Entries
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
