"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { getCurrentUser } from "@/lib/auth"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user = getCurrentUser()

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user && !pathname.startsWith("/auth")) {
      router.push("/auth")
    }
  }, [user, router, pathname])

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
