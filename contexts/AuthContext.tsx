"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        try {
          // Fetch user data from dashboard endpoint
          const response = await axiosInstance.get("/dashboard")
          setUser(response.data)
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("accessToken")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/login", { email, password })
      const token = response.data.acesstoken // Note: backend typo 'acesstoken'

      localStorage.setItem("accessToken", token)

      // Fetch user data
      const userResponse = await axiosInstance.get("/dashboard")
      setUser(userResponse.data)

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      await axiosInstance.post("/register", { username, email, password })
      // Registration successful, user can now login
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
