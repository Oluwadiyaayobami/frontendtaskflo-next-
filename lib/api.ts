const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface ApiError extends Error {
  status?: number
}

export async function apiCall(endpoint: string, options: RequestInit & { token?: string } = {}) {
  const { token, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = new Error(`API Error: ${response.statusText}`)
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return data
}
