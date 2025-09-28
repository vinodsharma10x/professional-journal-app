"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { EntriesContent } from "@/components/entries-content"

export default function EntriesPage() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <EntriesContent />
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
