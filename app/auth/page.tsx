"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Code2, Mail, Lock, User, ArrowLeft, Github } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, signUp } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      let title = "Authentication Error"
      let description = errorDescription || "An error occurred during authentication"
      
      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        title = "Email Link Expired"
        description = "Your email confirmation link has expired. Please try signing up again."
      } else if (error === 'Could not authenticate user') {
        title = "Authentication Failed"
        description = "There was a problem confirming your email. Please try again."
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      })
      
      // Clean URL
      router.replace('/auth')
    }
  }, [searchParams, toast, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("[v0] Starting authentication process", { isLogin, email: formData.email })

    try {
      if (isLogin) {
        console.log("[v0] Attempting sign in")
        const result = await signIn(formData.email, formData.password)
        console.log("[v0] Sign in result:", result)

        if (result.user) {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          })
          router.push("/dashboard")
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          console.log("[v0] Password mismatch")
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive",
          })
          return
        }

        console.log("[v0] Attempting sign up")
        const result = await signUp(formData.name, formData.email, formData.password)
        console.log("[v0] Sign up result:", result)

        toast({
          title: "Account created successfully!",
          description: "Please check your email and click the confirmation link to activate your account before signing in.",
        })
        
        // Clear form and switch to login mode
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
        setIsLogin(true)
      }
    } catch (error) {
      console.log("[v0] Authentication error:", error)
      
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      let title = "Authentication failed"
      let description = errorMessage

      // Provide more specific error messages
      if (errorMessage.includes("Email not confirmed")) {
        title = "Email not confirmed"
        description = "Please check your email and click the confirmation link before signing in."
      } else if (errorMessage.includes("Invalid login credentials")) {
        title = "Invalid credentials"
        description = "Please check your email and password, or confirm your email first."
      } else if (errorMessage.includes("User not found")) {
        title = "Account not found"
        description = "No account found with this email. Please sign up first."
      }

      toast({
        title,
        description,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      console.log("[v0] Authentication process completed")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">DevJournal</span>
              </Link>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin ? "Sign in to your DevJournal account" : "Start your developer journey today"}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
              <CardDescription className="text-center">
                {isLogin ? "Enter your credentials to access your journal" : "Fill in your details to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                    </div>
                  ) : (
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" type="button">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
