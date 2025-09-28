"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { EntryEditor } from "@/components/entry-editor"
import { use } from "react"

interface EntryPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default function EntryPage({ params }: EntryPageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <EntryEditor entryId={id} />
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
