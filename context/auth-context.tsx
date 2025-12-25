"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface Agent {
  id?: string
  fullName: string
  agentName: string
  matricNumber: string
  roomNumber: string
  residence: string
  email: string
  phoneNumber: string
  hasPaid: boolean
}

interface AuthContextType {
  agent: Agent | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (agentData: Omit<Agent, "id" | "hasPaid"> & { password: string }) => Promise<void>
  logout: () => void
  isLoading: boolean
  refreshToken: () => Promise<void>
  refreshAgent: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
      fetchAgentInfo(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchAgentInfo = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/agent`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAgent(data.userinfo[0])
      } else if (res.status === 401) {
        await refreshToken()
      } else {
        logout()
      }
    } catch (error) {
      console.error("Failed to fetch agent info:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAgent = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE_URL}/agent`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAgent(data.userinfo[0])
      }
    } catch (err) {
      console.error("Failed to refresh agent info:", err)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // important to store httpOnly refresh token
      })
      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      setToken(data.acesstoken)
      localStorage.setItem("token", data.acesstoken)

      await fetchAgentInfo(data.acesstoken)
    } catch (error) {
      throw error
    }
  }

  const register = async (agentData: Omit<Agent, "id" | "hasPaid"> & { password: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      })
      if (!res.ok) throw new Error("Registration failed")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setAgent(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: "POST",
        credentials: "include", // cookie must be sent
      })
      if (!res.ok) throw new Error("Failed to refresh token")

      const data = await res.json()
      setToken(data.acesstoken)
      localStorage.setItem("token", data.acesstoken)
      await fetchAgentInfo(data.acesstoken)
    } catch (error) {
      console.error("Refresh token failed", error)
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ agent, token, login, register, logout, isLoading, refreshToken, refreshAgent }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
