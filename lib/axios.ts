import axios from "axios"

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://eatro-hlcb.onrender.com/api/auth", // Adjust port as needed
  withCredentials: true, // Important for refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Call refresh endpoint (uses cookie automatically)
        const response = await axios.post("http://localhost:5000/api/refresh", {}, { withCredentials: true })

        const newAccessToken = response.data.acesstoken // Note: backend typo 'acesstoken'
        localStorage.setItem("accessToken", newAccessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
