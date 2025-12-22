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
import { 
  ArrowLeft, 
  Loader2, 
  Key, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  User, 
  Sparkles, 
  Shield,
  PlusCircle,
  Zap,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

function AddPasswordContent() {
  const [appName, setAppName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const calculatePasswordStrength = (pass: string) => {
    let score = 0
    const length = pass.length
    
    // Length check (max 40 points)
    if (length >= 12) score += 40
    else if (length >= 8) score += 25
    else score += 10

    // Complexity checks (60 points total)
    if (/[a-z]/.test(pass)) score += 15 // lowercase
    if (/[A-Z]/.test(pass)) score += 15 // uppercase
    if (/[0-9]/.test(pass)) score += 15 // numbers
    if (/[^a-zA-Z0-9]/.test(pass)) score += 15 // special chars

    return score
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 90) return 'text-green-500'
    if (strength >= 60) return 'text-yellow-500'
    if (strength >= 30) return 'text-orange-500'
    return 'text-red-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength >= 90) return 'Strong'
    if (strength >= 60) return 'Good'
    if (strength >= 30) return 'Fair'
    return 'Weak'
  }

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
    let generatedPassword = ''
    for (let i = 0; i < 16; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(generatedPassword)
    setPasswordStrength(calculatePasswordStrength(generatedPassword))
    setShowPassword(true)
    
    toast({
      title: "Password generated!",
      description: "A strong password has been created",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      await axiosInstance.post("/addnewpassword",
        { appName, username, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast({
        title: "Success!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Password saved securely to your vault
          </div>
        ),
      })

      // Reset form
      setAppName("")
      setUsername("")
      setPassword("")
      setPasswordStrength(0)

      // Redirect to passwords list
      setTimeout(() => {
        router.push("/passwords")
      }, 1500)
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/passwords">
            <motion.div
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" className="pl-0 group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Passwords
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl shadow-2xl">
            {/* Animated gradient border */}
            <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-xl -z-10" />
            
            {/* Animated background inside card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

            <CardHeader className="relative space-y-3 text-center pb-8">
              {/* Animated logo */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center mb-2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur opacity-30 animate-pulse" />
                  <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                    <Key className="h-10 w-10 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Add New Password
                </CardTitle>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardDescription className="text-muted-foreground text-base">
                  Store a new password securely in your encrypted vault
                </CardDescription>
              </motion.div>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex"
              >
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">End-to-End Encrypted</span>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="relative space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Application Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="appName" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    Application Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="appName"
                      type="text"
                      placeholder="e.g., Gmail, Facebook, GitHub"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      required
                      disabled={loading}
                      className={cn(
                        "pl-10 h-11 bg-background/50 border-border/50",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-300",
                        "placeholder:text-muted-foreground/60"
                      )}
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The name of the app or service where this password is used
                  </p>
                </motion.div>

                {/* Username/Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Username / Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="your.email@example.com or username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      className={cn(
                        "pl-10 h-11 bg-background/50 border-border/50",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-300",
                        "placeholder:text-muted-foreground/60"
                      )}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Password
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateStrongPassword}
                      disabled={loading}
                      className="gap-1 text-xs h-7"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Generate Strong
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password or generate one"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                      className={cn(
                        "pl-10 pr-10 h-11 bg-background/50 border-border/50",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-300",
                        "placeholder:text-muted-foreground/60"
                      )}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 pt-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password Strength</span>
                        <span className={cn("font-medium", getStrengthColor(passwordStrength))}>
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <Progress 
                        value={passwordStrength} 
                        className="h-2"
                        indicatorClassName={cn(
                          passwordStrength >= 90 ? 'bg-green-500' :
                          passwordStrength >= 60 ? 'bg-yellow-500' :
                          passwordStrength >= 30 ? 'bg-orange-500' : 'bg-red-500'
                        )}
                      />
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className={cn("text-center", password.length >= 8 ? 'text-green-500' : 'text-muted-foreground')}>
                          {password.length >= 8 ? '✓' : '○'} Length
                        </div>
                        <div className={cn("text-center", /[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-500' : 'text-muted-foreground')}>
                          {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'} Cases
                        </div>
                        <div className={cn("text-center", /[0-9]/.test(password) ? 'text-green-500' : 'text-muted-foreground')}>
                          {/[0-9]/.test(password) ? '✓' : '○'} Numbers
                        </div>
                        <div className={cn("text-center", /[^a-zA-Z0-9]/.test(password) ? 'text-green-500' : 'text-muted-foreground')}>
                          {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Special
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Your password will be encrypted with AES-256 before storage
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                >
                  <Button
                    type="submit"
                    className={cn(
                      "flex-1 h-11 relative overflow-hidden group",
                      "bg-gradient-to-r from-primary to-primary/90",
                      "hover:from-primary/90 hover:to-primary/80",
                      "active:scale-[0.99] transition-all duration-200",
                      "shadow-lg shadow-primary/20",
                      loading && "opacity-90 cursor-not-allowed"
                    )}
                    disabled={loading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        x: loading ? [0, 400, 0] : 0,
                      }}
                      transition={loading ? { repeat: Infinity, duration: 2 } : {}}
                    />
                    
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 relative">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Password...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 relative">
                        <PlusCircle className="h-4 w-4" />
                        <span>Save Password</span>
                      </div>
                    )}
                  </Button>

                  <Link href="/passwords" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 border-border/50 hover:border-primary/30 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>
                </motion.div>
              </form>

              {/* Security Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-6 border-t border-border/30"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">Security Tips</span>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                      Use a unique password for each account
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                      Enable two-factor authentication when available
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                      Regularly update your passwords every 90 days
                    </li>
                  </ul>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>
            <Shield className="h-3 w-3 inline mr-1" />
            All data is encrypted end-to-end with military-grade AES-256 encryption
          </p>
        </motion.div>
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