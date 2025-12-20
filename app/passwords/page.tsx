"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import axiosInstance from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Copy, Shield } from "lucide-react"

interface Password {
  id: string
  appName: string
  username: string
  password: string // Already decrypted by backend
}

function PasswordsContent() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [loading, setLoading] = useState(true)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = async () => {
    try {
      const response = await axiosInstance.get("/allpassword")
      setPasswords(response.data.passwords || response.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch passwords",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/passwords/add">
            <Button>Add New Password</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            {"Password Vault"}
          </h1>
          <p className="text-muted-foreground">
            {passwords.length === 0
              ? "No passwords stored yet"
              : `${passwords.length} password${passwords.length !== 1 ? "s" : ""} stored securely`}
          </p>
        </div>

        {passwords.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{"No passwords yet"}</h3>
              <p className="text-muted-foreground mb-6">{"Start securing your passwords by adding your first entry"}</p>
              <Link href="/passwords/add">
                <Button>Add Your First Password</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passwords.map((pwd) => (
              <Card key={pwd.id} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{pwd.appName}</CardTitle>
                  <CardDescription className="text-muted-foreground">{"Stored credential"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-muted-foreground">Username</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pwd.username, "Username")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground font-mono bg-muted px-3 py-2 rounded">{pwd.username}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-muted-foreground">Password</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(pwd.id)}>
                          {visiblePasswords.has(pwd.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pwd.password, "Password")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground font-mono bg-muted px-3 py-2 rounded">
                      {visiblePasswords.has(pwd.id) ? pwd.password : "••••••••••••"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PasswordsPage() {
  return (
    <ProtectedRoute>
      <PasswordsContent />
    </ProtectedRoute>
  )
}
