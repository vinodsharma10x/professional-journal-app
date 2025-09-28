// Mock authentication utilities
// In a real app, this would integrate with your auth provider

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro"
  createdAt: Date
}

export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/diverse-user-avatars.png",
  plan: "pro",
  createdAt: new Date("2024-01-15"),
}

export function signIn(email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("devjournal_auth", "true")
      localStorage.setItem("devjournal_user", JSON.stringify(mockUser))
      resolve(mockUser)
    }, 1000)
  })
}

export function signUp(name: string, email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = { ...mockUser, name, email }
      localStorage.setItem("devjournal_auth", "true")
      localStorage.setItem("devjournal_user", JSON.stringify(newUser))
      resolve(newUser)
    }, 1000)
  })
}

export function signOut(): void {
  localStorage.removeItem("devjournal_auth")
  localStorage.removeItem("devjournal_user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("devjournal_user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("devjournal_auth") === "true"
}
