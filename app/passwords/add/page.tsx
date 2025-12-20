"use client"

import type React from "react"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import axiosInstance from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Key } from "lucide-react"

function AddPasswordContent() {
  const [appName, setAppName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Function to request a new access token from the backend
  const getAccessToken = async () => {
    try {
      const response = await axiosInstance.post(
        "/refresh", // backend endpoint for refreshing token
        {},
        { withCredentials: true } // sends HTTP-only refresh token cookie automatically
      )
      return response.data.acesstoken // backend should return JWT
    } catch (err) {
      console.error("Failed to get access token", err)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Request access token from backend
      const token = await getAccessToken()
      if (!token) {
        toast({
          title: "Authentication error",
          description: "Could not get access token. Please login again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Send password creation request with token in headers
      await axiosInstance.post(
        "/addnewpassword",
        { appName, username, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast({
        title: "Success!",
        description: "Password saved securely to your vault",
      })

      // Reset form
      setAppName("")
      setUsername("")
      setPassword("")

      // Redirect to passwords list
      setTimeout(() => {
        router.push("/passwords")
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto border-border">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-card-foreground">Add New Password</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {"Store a new password securely in your encrypted vault"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  type="text"
                  placeholder="e.g., Gmail, Facebook, GitHub"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">{"The name of the app or service"}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your.email@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">{"Your password will be encrypted before storage"}</p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Password"
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AddPasswordPage() {
  return (
    <ProtectedRoute>
      <AddPasswordContent />
    </ProtectedRoute>
  )
}
