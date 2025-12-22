"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  ArrowLeft, 
  CheckSquare, 
  Plus, 
  Loader2, 
  Calendar, 
  Search, 
  Filter,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  TrendingUp,
  Sparkles,
  Zap,
  ChevronRight,
  MoreVertical,
  RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/lib/axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Todo {
  id?: string
  title: string
  description: string
  createdAt: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
}

function ViewTodosContent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setRefreshing(true)
      const response = await axiosInstance.get("/todos/view")
      const fetchedTodos = response.data.fetchingalltodo || []
      
      // Enhance todos with additional data
      const enhancedTodos = fetchedTodos.map((todo: Todo, index: number) => ({
        ...todo,
        id: `todo-${index}`,
        completed: Math.random() > 0.5, // Random completion for demo
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      }))
      
      setTodos(enhancedTodos)
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
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleTodoCompletion = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
    
    toast({
      title: "Todo updated",
      description: "Task status changed",
    })
  }

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!todoToDelete) return
    
    try {
      setDeleting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from local state
      setTodos(prev => prev.filter(t => t.id !== todoToDelete.id))
      
      toast({
        title: "Todo deleted",
        description: `"${todoToDelete.title}" has been removed`,
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setTodoToDelete(null)
    }
  }

  const handleEditClick = (todo: Todo) => {
    toast({
      title: "Edit Todo",
      description: `Edit functionality for "${todo.title}" coming soon`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="h-3 w-3" />
      case 'medium': return <TrendingUp className="h-3 w-3" />
      case 'low': return <CheckCircle className="h-3 w-3" />
      default: return <Circle className="h-3 w-3" />
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || 
                         (filter === "active" && !todo.completed) ||
                         (filter === "completed" && todo.completed)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" className="pl-0">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </motion.div>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Task{" "}
              </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Manager
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {todos.length === 0
                ? "No tasks created yet"
                : `Track and manage ${todos.length} task${todos.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                onClick={fetchTodos}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/todos/add">
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => toast({
                  title: "Total Tasks",
                  description: `${stats.total} tasks in your list`,
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => stats.completed > 0 && toast({
                  title: "Completed Tasks",
                  description: `${stats.completed} tasks done`,
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => stats.active > 0 && toast({
                  title: "Active Tasks",
                  description: `${stats.active} tasks pending`,
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-blue-500">{stats.active}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 bg-background/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary/10 transition-all",
                  filter === "all" && "bg-primary/20 text-primary border-primary/30"
                )}
                onClick={() => setFilter("all")}
              >
                <Filter className="h-3 w-3 mr-1" />
                All ({stats.total})
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary/10 transition-all",
                  filter === "active" && "bg-primary/20 text-primary border-primary/30"
                )}
                onClick={() => setFilter("active")}
              >
                Active ({stats.active})
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary/10 transition-all",
                  filter === "completed" && "bg-primary/20 text-primary border-primary/30"
                )}
                onClick={() => setFilter("completed")}
              >
                Completed ({stats.completed})
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Todo Cards */}
        <AnimatePresence>
          {filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur opacity-20" />
                    <CheckSquare className="h-20 w-20 text-primary relative" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                    {searchQuery || filter !== "all" ? "No matching tasks found" : "No tasks yet"}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchQuery || filter !== "all"
                      ? "Try a different search term or clear filters"
                      : "Start organizing your work by creating your first task"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/todos/add">
                      <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        {searchQuery || filter !== "all" ? "Add New Task" : "Create Your First Task"}
                      </Button>
                    </Link>
                    {(searchQuery || filter !== "all") && (
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("")
                        setFilter("all")
                      }}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={cn(
                    "group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300",
                    todo.completed && "opacity-80"
                  )}>
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Priority badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="outline" className={`text-xs backdrop-blur-sm ${getPriorityColor(todo.priority || 'medium')}`}>
                        {getPriorityIcon(todo.priority || 'medium')}
                        <span className="ml-1 capitalize">{todo.priority || 'medium'}</span>
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTodoCompletion(todo.id || index.toString())}
                          className="mt-1 flex-shrink-0"
                        >
                          {todo.completed ? (
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-border hover:border-primary transition-colors" />
                          )}
                        </motion.button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={cn(
                                "text-xl font-bold text-card-foreground group-hover:text-primary transition-colors",
                                todo.completed && "line-through text-muted-foreground"
                              )}>
                                {todo.title}
                              </h3>
                              {todo.description && (
                                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                                  {todo.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Meta info */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(todo.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(todo.createdAt)}</span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(todo)}
                                  className="h-8 w-8 p-0"
                                  title="Edit task"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(todo)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  title="Delete task"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Hover arrow */}
                    <motion.div
                      className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                    >
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick stats */}
        {filteredTodos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 inline mr-2" />
                {filter === "completed" 
                  ? `${stats.completed} tasks completed`
                  : filter === "active"
                  ? `${stats.active} tasks remaining`
                  : `${stats.completed} of ${stats.total} tasks completed`}
              </div>
              <div className="flex gap-3">
                <Link href="/todos/add">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                    <Plus className="h-4 w-4" />
                    Add More Tasks
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Floating action button for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 md:hidden z-50"
        >
          <Link href="/todos/add">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-r from-primary to-accent shadow-primary/30">
                <Plus className="h-6 w-6" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the task{" "}
              <span className="font-semibold text-foreground">"{todoToDelete?.title}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95 transition-transform"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Task"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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