"use client"

import type React from "react"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, CheckSquare, Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation"

function AddTodoContent() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post("/todos/add", {
        title,
        description,
      })

      toast({
        title: "Success",
        description: response.data.message || "Todo created successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")

      // Redirect to view todos page after 1 second
      setTimeout(() => {
        router.push("/todos")
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create todo",
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
              <CheckSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-card-foreground">Add New Todo</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {"Create a new task to stay organized and productive"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Complete project documentation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">{"Optional: Add more context or notes"}</p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Todo
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

export default function AddTodoPage() {
  return (
    <ProtectedRoute>
      <AddTodoContent />
    </ProtectedRoute>
  )
}
