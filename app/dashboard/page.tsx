// "use client"

// import ProtectedRoute from "@/components/ProtectedRoute"
// import { useAuth } from "@/contexts/AuthContext"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import Link from "next/link"
// import { Shield, Key, CheckSquare, LogOut, Plus } from "lucide-react"

// function DashboardContent() {
//   const { user, logout } = useAuth()

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Shield className="h-8 w-8 text-primary" />
//             <span className="text-2xl font-bold text-foreground">SecureVault</span>
//           </div>
//           <Button variant="ghost" onClick={logout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </Button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2 text-foreground">
//             {"Welcome back, "}
//             {user?.username || "User"}!
//           </h1>
//           <p className="text-muted-foreground">
//             {"User ID: "}
//             {user?.id || "N/A"}
//           </p>
//         </div>

//         {/* Quick Actions Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <Link href="/passwords/add">
//             <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <Key className="h-10 w-10 text-primary" />
//                   <Plus className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <CardTitle className="text-card-foreground">Add New Password</CardTitle>
//                 <CardDescription>{"Store a new password securely in your vault"}</CardDescription>
//               </CardHeader>
//             </Card>
//           </Link>

//           <Link href="/passwords">
//             <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
//               <CardHeader>
//                 <Shield className="h-10 w-10 text-accent mb-2" />
//                 <CardTitle className="text-card-foreground">View Passwords</CardTitle>
//                 <CardDescription>{"Access and manage your stored passwords"}</CardDescription>
//               </CardHeader>
//             </Card>
//           </Link>

//           <Link href="/todos/add">
//             <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CheckSquare className="h-10 w-10 text-primary" />
//                   <Plus className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <CardTitle className="text-card-foreground">Add New Todo</CardTitle>
//                 <CardDescription>{"Create a new task to stay organized"}</CardDescription>
//               </CardHeader>
//             </Card>
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <Card className="border-border bg-card">
//             <CardHeader>
//               <CardTitle className="text-sm font-medium text-muted-foreground">Total Passwords</CardTitle>
//               <div className="text-3xl font-bold text-card-foreground">—</div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">{"Securely encrypted"}</p>
//             </CardContent>
//           </Card>

//           <Card className="border-border bg-card">
//             <CardHeader>
//               <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
//               <div className="text-3xl font-bold text-card-foreground">—</div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">{"Coming soon"}</p>
//             </CardContent>
//           </Card>

//           <Card className="border-border bg-card">
//             <CardHeader>
//               <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
//               <div className="text-3xl font-bold text-primary">A+</div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">{"Excellent security"}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <DashboardContent />
//     </ProtectedRoute>
//   )
// }
"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Key, CheckSquare, LogOut, Plus } from "lucide-react"

function DashboardContent() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SecureVault</span>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            {"Welcome back, "}
            {user?.username || "User"}!
          </h1>
          <p className="text-muted-foreground">
            {"User ID: "}
            {user?.id || "N/A"}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/passwords/add">
            <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Key className="h-10 w-10 text-primary" />
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Add New Password</CardTitle>
                <CardDescription>{"Store a new password securely in your vault"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/passwords">
            <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <Shield className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-card-foreground">View Passwords</CardTitle>
                <CardDescription>{"Access and manage your stored passwords"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/todos/add">
            <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CheckSquare className="h-10 w-10 text-primary" />
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Add New Todo</CardTitle>
                <CardDescription>{"Create a new task to stay organized"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/todos/view">
            <Card className="border-border hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <CheckSquare className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-card-foreground">View Todos</CardTitle>
                <CardDescription>{"Access and manage all your tasks"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Passwords</CardTitle>
              <div className="text-3xl font-bold text-card-foreground">—</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{"Securely encrypted"}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
              <div className="text-3xl font-bold text-card-foreground">—</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{"Coming soon"}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
              <div className="text-3xl font-bold text-primary">A+</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{"Excellent security"}</p>
            </CardContent>
          </Card>
        </div>
      </main>
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
