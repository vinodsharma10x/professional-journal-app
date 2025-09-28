import { EntryEditor } from "@/components/entry-editor"

export default function EditEntryPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Edit Entry</h1>
        <p className="text-muted-foreground text-pretty">
          Update your journal entry with new insights and information.
        </p>
      </div>
      <EntryEditor entryId={params.id} />
    </div>
  )
}
