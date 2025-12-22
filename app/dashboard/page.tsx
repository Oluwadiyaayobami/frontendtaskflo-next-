"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { 
  Shield, 
  Key, 
  CheckSquare, 
  LogOut, 
  Plus, 
  AlertTriangle, 
  TrendingUp,
  Bell,
  Settings,
  Search,
  Eye,
  Lock,
  RefreshCw,
  Sparkles,
  BarChart3,
  Users,
  ChevronRight,
  Zap,
  ShieldCheck,
  Fingerprint
} from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface Password {
  appName: string
  username: string
  password: string
}

interface Todo {
  title: string
  description: string
  createdAt: string
}

function calculateSecurityScore(passwords: Password[]): { 
  score: number; 
  grade: string; 
  message: string;
  color: string;
  level: string;
} {
  if (passwords.length === 0) {
    return { 
      score: 100, 
      grade: "N/A", 
      message: "No passwords stored yet", 
      color: "text-muted-foreground",
      level: "neutral"
    }
  }

  let totalScore = 0
  let weakPasswords = 0

  passwords.forEach((pwd) => {
    const password = pwd.password
    let passwordScore = 0

    // Length check (max 40 points)
    if (password.length >= 12) passwordScore += 40
    else if (password.length >= 8) passwordScore += 25
    else passwordScore += 10

    // Complexity checks (60 points total)
    if (/[a-z]/.test(password)) passwordScore += 15 // lowercase
    if (/[A-Z]/.test(password)) passwordScore += 15 // uppercase
    if (/[0-9]/.test(password)) passwordScore += 15 // numbers
    if (/[^a-zA-Z0-9]/.test(password)) passwordScore += 15 // special chars

    totalScore += passwordScore
    if (passwordScore < 60) weakPasswords++
  })

  const averageScore = Math.round(totalScore / passwords.length)

  let grade = "F"
  let message = "Critical security issues"
  let color = "text-red-500"
  let level = "critical"

  if (averageScore >= 90) {
    grade = "A+"
    message = "Excellent security"
    color = "text-green-500"
    level = "excellent"
  } else if (averageScore >= 80) {
    grade = "A"
    message = "Strong security"
    color = "text-green-500"
    level = "strong"
  } else if (averageScore >= 70) {
    grade = "B"
    message = "Good security"
    color = "text-yellow-500"
    level = "good"
  } else if (averageScore >= 60) {
    grade = "C"
    message = "Fair security"
    color = "text-yellow-500"
    level = "fair"
  } else if (averageScore >= 50) {
    grade = "D"
    message = "Weak security"
    color = "text-red-500"
    level = "weak"
  }

  if (weakPasswords > 0) {
    message = `${weakPasswords} weak password${weakPasswords > 1 ? "s" : ""} detected`
  }

  return { score: averageScore, grade, message, color, level }
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const [passwordCount, setPasswordCount] = useState<number>(0)
  const [todoCount, setTodoCount] = useState<number>(0)
  const [securityScore, setSecurityScore] = useState({ 
    score: 100, 
    grade: "N/A", 
    message: "Loading...",
    color: "text-muted-foreground",
    level: "neutral"
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [recentPasswords, setRecentPasswords] = useState<Password[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const fetchStats = async () => {
    try {
      setRefreshing(true)

      // Fetch passwords
      const passwordsRes = await api.get("/allpassword")
      const passwords = passwordsRes.data.passwords || []
      setPasswordCount(passwords.length)
      setRecentPasswords(passwords.slice(0, 3))

      // Calculate security score based on passwords
      const security = calculateSecurityScore(passwords)
      setSecurityScore(security)

      // Fetch todos
      try {
        const todosRes = await api.get("/todos/view")
        const todos = todosRes.data.fetchingalltodo || []
        setTodoCount(todos.length)
      } catch (todoError: any) {
        // If 404, it means no todos exist
        if (todoError.response?.status === 404) {
          setTodoCount(0)
        } else {
          console.error("Error fetching todos:", todoError)
        }
      }

      toast({
        title: "Dashboard updated",
        description: "Your statistics have been refreshed",
      })
    } catch (error: any) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'excellent': return 'from-green-500/20 to-green-500/5'
      case 'strong': return 'from-green-400/20 to-green-400/5'
      case 'good': return 'from-yellow-500/20 to-yellow-500/5'
      case 'fair': return 'from-yellow-400/20 to-yellow-400/5'
      case 'weak': return 'from-red-500/20 to-red-500/5'
      case 'critical': return 'from-red-600/20 to-red-600/5'
      default: return 'from-primary/20 to-primary/5'
    }
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "U"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const cardHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg blur opacity-20" />
              <Shield className="h-8 w-8 text-primary relative" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SecureVault
            </span>
            <Badge variant="secondary" className="ml-2 hidden sm:flex">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input 
                placeholder="Search vault..." 
                className="pl-10 w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={fetchStats}
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <div className="relative group">
              <Avatar className="h-10 w-10 border-2 border-primary/20 cursor-pointer">
                
                <AvatarFallback className="bg-primary text-white font-semibold">
                    {getInitials(user?.username || "User")}
                </AvatarFallback>

              </Avatar>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2 px-4 border-b border-border">
                  <p className="text-sm font-semibold">{user?.username || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email }</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start rounded-none"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Welcome back,{" "}
                </span>
                    <motion.span
                      animate={{ color: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))"] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="font-semibold"
                    >
                      {user?.username || "User"}!
                    </motion.span>

              </h1>
              <p className="text-muted-foreground text-lg">
                Your vault is secured with military-grade encryption
              </p>
            </div>
            
            <Badge variant="outline" className="px-4 py-2">
              <Fingerprint className="h-4 w-4 mr-2" />
              User ID: {user?.id?.slice(0, 8) || "N/A"}...
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Passwords Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="initial"
              variants={cardHoverVariants}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-sm" />
                      <Badge variant="secondary" className="relative">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{Math.floor(passwordCount * 0.2)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-4">
                    {loading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      passwordCount
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">Total Passwords</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 mr-1" />
                    All encrypted with AES-256
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Total Tasks Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="initial"
              variants={cardHoverVariants}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <CheckSquare className="h-6 w-6 text-accent" />
                    </div>
                    <Badge variant="outline">
                      {loading ? "..." : todoCount === 0 ? "Empty" : "Active"}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-4">
                    {loading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      todoCount
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">Total Tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    {todoCount === 0 ? "No tasks yet" : `${todoCount} task${todoCount > 1 ? 's' : ''} tracked`}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Security Score Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="initial"
              variants={cardHoverVariants}
            >
              <Card className={`group relative overflow-hidden border-border/50 backdrop-blur-sm bg-gradient-to-br ${getLevelColor(securityScore.level)}`}>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                />
                <CardHeader className="pb-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white/10">
                      <ShieldCheck className={`h-6 w-6 ${securityScore.color}`} />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={securityScore.color.replace('text-', 'bg-').replace('500', '500/20')}
                    >
                      {securityScore.grade}
                    </Badge>
                  </div>
                  <CardTitle className={`text-3xl font-bold mt-4 ${securityScore.color}`}>
                    {loading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      `${securityScore.score}%`
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">Security Score</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={securityScore.score} className="h-2 mb-2" />
                  <div className="flex items-center text-xs gap-2">
                    {securityScore.level === 'excellent' || securityScore.level === 'strong' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : securityScore.level === 'neutral' ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    )}
                    <span className="text-muted-foreground">{securityScore.message}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Vault Health Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover="hover"
              initial="initial"
              variants={cardHoverVariants}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <BarChart3 className="h-6 w-6 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {passwordCount > 0 ? "Active" : "Setup"}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-4">
                    {loading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      passwordCount > 0 ? "Healthy" : "New"
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">Vault Health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    {passwordCount > 0 ? "All systems operational" : "Add your first password"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                href: "/passwords/add", 
                icon: Key, 
                title: "Add Password", 
                description: "Store new credentials securely",
                color: "from-primary to-primary/60",
                iconBg: "bg-primary/20"
              },
              { 
                href: "/passwords", 
                icon: Eye, 
                title: "View Passwords", 
                description: "Manage stored credentials",
                color: "from-accent to-accent/60",
                iconBg: "bg-accent/20"
              },
              { 
                href: "/todos/add", 
                icon: CheckSquare, 
                title: "Add Todo", 
                description: "Create a new task",
                color: "from-green-500 to-green-400",
                iconBg: "bg-green-500/20"
              },
              { 
                href: "/todos/view", 
                icon: CheckSquare, 
                title: "View Todos", 
                description: "Manage all tasks",
                color: "from-orange-500 to-orange-400",
                iconBg: "bg-orange-500/20"
              }
            ].map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm h-full">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{
                          background: [
                            `linear-gradient(135deg, var(--primary)/5, transparent)`,
                            `linear-gradient(135deg, var(--primary)/10, transparent)`,
                            `linear-gradient(135deg, var(--primary)/5, transparent)`
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <CardHeader className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </motion.div>
                        </div>
                        <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {action.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                          <Zap className="h-3 w-3 mr-1" />
                          Quick access
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Passwords Section */}
        {recentPasswords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Recent Passwords
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Last Updated
                  </Badge>
                </CardTitle>
                <CardDescription>Your most recent credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPasswords.map((password, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{password.appName}</p>
                          <p className="text-xs text-muted-foreground">{password.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {password.password.length >= 12 ? "Strong" : 
                           password.password.length >= 8 ? "Medium" : "Weak"}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Tips
              </CardTitle>
              <CardDescription>Keep your vault secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Lock, text: "Use unique passwords for each account", color: "text-blue-500" },
                  { icon: ShieldCheck, text: "Enable two-factor authentication", color: "text-green-500" },
                  { icon: AlertTriangle, text: "Regularly update your passwords", color: "text-yellow-500" }
                ].map((tip, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className={`p-2 rounded-md ${tip.color.replace('text-', 'bg-')}/20`}>
                      <tip.icon className={`h-4 w-4 ${tip.color}`} />
                    </div>
                    <p className="text-sm">{tip.text}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-border/40 mt-12"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">SecureVault</span>
              <span className="text-xs text-muted-foreground ml-2">v2.1.0</span>
            </div>
            <div className="text-sm text-muted-foreground">
              All data encrypted with AES-256 • Last sync: Just now
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}