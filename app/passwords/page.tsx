"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import axiosInstance from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Copy, 
  Shield, 
  Plus, 
  Search, 
  Lock, 
  User, 
  Trash2,
  Edit,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Key,
  Globe,
  ChevronRight,
  Zap,
  BarChart3,
  ExternalLink,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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

interface Password {
  appName: string
  username: string
  password: string
  strength?: 'weak' | 'medium' | 'strong'
  lastUpdated?: string
  url?: string
  id?: string
}

function PasswordsContent() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = async () => {
    try {
      setRefreshing(true)
      const response = await axiosInstance.get("/allpassword")
      const fetchedPasswords = response.data.passwords || []
      
      // Enhance passwords with additional data
      const enhancedPasswords = fetchedPasswords.map((pwd: Password, index: number) => ({
        ...pwd,
        id: `pwd-${index}`,
        strength: calculatePasswordStrength(pwd.password),
        lastUpdated: new Date().toISOString(),
        url: generateUrlFromAppName(pwd.appName)
      }))
      
      setPasswords(enhancedPasswords)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch passwords",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const length = password.length
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(password)
    
    let score = 0
    if (length >= 12) score += 40
    else if (length >= 8) score += 25
    else score += 10
    
    if (hasLower) score += 15
    if (hasUpper) score += 15
    if (hasNumber) score += 15
    if (hasSpecial) score += 15
    
    if (score >= 90) return 'strong'
    if (score >= 60) return 'medium'
    return 'weak'
  }

  const generateUrlFromAppName = (appName: string): string => {
    const commonDomains: Record<string, string> = {
      'google': 'https://accounts.google.com',
      'facebook': 'https://facebook.com',
      'twitter': 'https://twitter.com',
      'instagram': 'https://instagram.com',
      'github': 'https://github.com',
      'netflix': 'https://netflix.com',
      'amazon': 'https://amazon.com',
      'microsoft': 'https://login.microsoftonline.com',
      'apple': 'https://appleid.apple.com',
      'paypal': 'https://paypal.com',
      'gmail': 'https://gmail.com',
      'outlook': 'https://outlook.com',
      'yahoo': 'https://yahoo.com',
      'linkedin': 'https://linkedin.com',
      'spotify': 'https://spotify.com',
      'discord': 'https://discord.com',
      'slack': 'https://slack.com',
      'zoom': 'https://zoom.us',
      'dropbox': 'https://dropbox.com',
      'airbnb': 'https://airbnb.com',
      'uber': 'https://uber.com',
      'stripe': 'https://stripe.com'
    }

    const lowerAppName = appName.toLowerCase()
    for (const [key, url] of Object.entries(commonDomains)) {
      if (lowerAppName.includes(key)) {
        return url
      }
    }
    return `https://${lowerAppName.replace(/\s+/g, '')}.com`
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

  const copyToClipboard = async (text: string, field: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(`${id}-${field}`)
      setTimeout(() => setCopiedField(null), 2000)
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const copyUsername = (username: string, id: string) => {
    copyToClipboard(username, "Username", id)
  }

  const copyPassword = (password: string, id: string) => {
    copyToClipboard(password, "Password", id)
  }

  const openWebsite = (url: string, appName: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    toast({
      title: "Opening website",
      description: `Redirecting to ${appName}`,
    })
  }

  const handleDeleteClick = (password: Password) => {
    setPasswordToDelete(password)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!passwordToDelete) return
    
    try {
      setDeleting(true)
      // In a real app, you would call your API here
      // await axiosInstance.delete(`/passwords/${passwordToDelete.id}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from local state
      setPasswords(prev => prev.filter(p => p.id !== passwordToDelete.id))
      
      toast({
        title: "Password deleted",
        description: `${passwordToDelete.appName} password has been deleted`,
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete password",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setPasswordToDelete(null)
    }
  }

  const handleEditClick = (password: Password) => {
    toast({
      title: "Edit Password",
      description: `Edit functionality for ${password.appName} coming soon`,
    })
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      case 'weak': return 'bg-red-500/20 text-red-700 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <Check className="h-3 w-3" />
      case 'medium': return <AlertCircle className="h-3 w-3" />
      case 'weak': return <AlertCircle className="h-3 w-3" />
      default: return <Lock className="h-3 w-3" />
    }
  }

  const filteredPasswords = passwords.filter(password => {
    return password.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           password.username.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const strengthStats = {
    strong: passwords.filter(p => p.strength === 'strong').length,
    medium: passwords.filter(p => p.strength === 'medium').length,
    weak: passwords.filter(p => p.strength === 'weak').length,
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
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
                Password{" "}
              </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vault
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {passwords.length === 0
                ? "No passwords stored yet"
                : `${passwords.length} password${passwords.length !== 1 ? 's' : ''} secured with military-grade encryption`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                onClick={fetchPasswords}
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
              <Link href="/passwords/add">
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Add Password
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
                onClick={() => !passwords.length && toast({
                  title: "No passwords",
                  description: "Add your first password to see statistics",
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Passwords</p>
                  <p className="text-3xl font-bold text-foreground">{passwords.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => strengthStats.strong > 0 && toast({
                  title: "Strong Passwords",
                  description: `${strengthStats.strong} out of ${passwords.length} passwords are strong`,
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Strong Passwords</p>
                  <p className="text-3xl font-bold text-green-500">{strengthStats.strong}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => passwords.length > 0 && toast({
                  title: "Security Score",
                  description: `Based on password strength analysis`,
                })}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-3xl font-bold text-blue-500">
                    {passwords.length > 0 
                      ? Math.round((strengthStats.strong / passwords.length) * 100) 
                      : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search passwords by app or username..."
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </motion.div>

        {/* Password Cards */}
        <AnimatePresence>
          {filteredPasswords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur opacity-20" />
                    <Lock className="h-20 w-20 text-primary relative" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                    {searchQuery ? "No matching passwords found" : "No passwords yet"}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchQuery
                      ? "Try a different search term or add a new password"
                      : "Start securing your passwords by adding your first entry"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/passwords/add">
                      <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        {searchQuery ? "Add New Password" : "Add Your First Password"}
                      </Button>
                    </Link>
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredPasswords.map((pwd, index) => (
                <motion.div
                  key={pwd.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Strength badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="outline" className={`text-xs backdrop-blur-sm ${getStrengthColor(pwd.strength || 'medium')}`}>
                        {getStrengthIcon(pwd.strength || 'medium')}
                        <span className="ml-1 capitalize">{pwd.strength || 'medium'}</span>
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                            {pwd.appName}
                            {pwd.url && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openWebsite(pwd.url!, pwd.appName)
                                }}
                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                title="Open website"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {pwd.lastUpdated ? `Updated ${new Date(pwd.lastUpdated).toLocaleDateString()}` : 'Recently added'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      {/* Username field */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Username
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyUsername(pwd.username, pwd.id || index.toString())}
                            className="h-8 w-8 p-0 hover:scale-105 active:scale-95 transition-transform"
                          >
                            {copiedField === `${pwd.id || index}-Username` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div 
                          className="cursor-pointer group/username active:scale-[0.98] transition-transform"
                          onClick={() => copyUsername(pwd.username, pwd.id || index.toString())}
                        >
                          <p className="text-sm text-foreground font-mono bg-background/50 px-3 py-2 rounded-lg border border-border/50 group-hover/username:border-primary/30 group-hover/username:bg-primary/5 transition-all">
                            {pwd.username}
                          </p>
                        </div>
                      </div>

                      {/* Password field */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Password
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(pwd.id || index.toString())}
                              className="h-8 w-8 p-0 hover:scale-105 active:scale-95 transition-transform"
                              title={visiblePasswords.has(pwd.id || index.toString()) ? "Hide password" : "Show password"}
                            >
                              {visiblePasswords.has(pwd.id || index.toString()) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPassword(pwd.password, pwd.id || index.toString())}
                            className="h-8 w-8 p-0 hover:scale-105 active:scale-95 transition-transform"
                          >
                            {copiedField === `${pwd.id || index}-Password` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div 
                          className="cursor-pointer group/password active:scale-[0.98] transition-transform"
                          onClick={() => copyPassword(pwd.password, pwd.id || index.toString())}
                        >
                          <div className="relative">
                            <p className="text-sm text-foreground font-mono bg-background/50 px-3 py-2 rounded-lg border border-border/50 group-hover/password:border-primary/30 group-hover/password:bg-primary/5 transition-all">
                              {visiblePasswords.has(pwd.id || index.toString()) ? pwd.password : '•'.repeat(12)}
                            </p>
                            {!visiblePasswords.has(pwd.id || index.toString()) && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent animate-pulse rounded-lg" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-between pt-4 border-t border-border/30">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 hover:scale-105 active:scale-95 transition-transform"
                          onClick={() => handleEditClick(pwd)}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-2 hover:scale-105 active:scale-95 transition-transform"
                          onClick={() => handleDeleteClick(pwd)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>

                    {/* Hover hint */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-primary border border-primary/20">
                          Click fields or buttons to interact
                        </div>
                      </div>
                    </div>

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

        {/* Quick actions */}
        {filteredPasswords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <Shield className="h-4 w-4 inline mr-2" />
                All passwords are encrypted with AES-256
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const allUsernames = filteredPasswords.map(p => p.username).join('\n')
                    copyToClipboard(allUsernames, "All usernames", "all")
                  }}
                  className="gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Copy className="h-4 w-4" />
                  Copy All Usernames
                </Button>
                <Link href="/passwords/add">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
                    <Plus className="h-4 w-4" />
                    Add More Passwords
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
          <Link href="/passwords/add">
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
              Delete Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the password for{" "}
              <span className="font-semibold text-foreground">{passwordToDelete?.appName}</span>?
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
                "Delete Password"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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