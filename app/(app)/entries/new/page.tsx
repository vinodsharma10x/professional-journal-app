import { EntryEditor } from "@/components/entry-editor"

export default function NewEntryPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Create New Entry</h1>
        <p className="text-muted-foreground text-pretty">Document your learning, projects, and professional growth.</p>
      </div>
      <EntryEditor />
    </div>
  )
}
