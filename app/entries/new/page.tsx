"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { EntryEditor } from "@/components/entry-editor"

export default function NewEntryPage() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <EntryEditor />
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
