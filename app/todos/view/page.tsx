"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, CheckSquare, Plus, Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axios"

interface Todo {
  _id: string
  title: string
  description: string
  userid: string
  createdAt?: string
  updatedAt?: string
}

function ViewTodosContent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axiosInstance.get("/todos/view")
        setTodos(response.data.fetchingalltodo || [])
      } catch (error: any) {
        if (error.response?.status === 404) {
          setTodos([])
        } else {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to fetch todos",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [toast])

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
          <Link href="/todos/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </Link>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-card-foreground">Your Todos</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {"Manage your tasks and stay organized"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">No todos yet</h3>
                <p className="text-muted-foreground mb-4">{"Get started by creating your first task"}</p>
                <Link href="/todos/add">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Todo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.map((todo) => (
                  <Card key={todo._id} className="border-border bg-card hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="text-xl text-card-foreground">{todo.title}</CardTitle>
                      {todo.description && (
                        <CardDescription className="text-muted-foreground whitespace-pre-wrap">
                          {todo.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ViewTodosPage() {
  return (
    <ProtectedRoute>
      <ViewTodosContent />
    </ProtectedRoute>
  )
}
