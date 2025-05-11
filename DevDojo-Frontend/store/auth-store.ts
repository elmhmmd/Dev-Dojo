import { create } from "zustand"
import { authApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { User } from "@/types/api-types"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  username: string
  email: string
  password: string
  role_id: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,
  isAdmin: false,

  login: async (credentials) => {
    try {
      set({ isLoading: true })
      const { data, error } = await authApi.login(credentials)

      if (error || !data) {
        toast({
          title: "Login failed",
          description: error || "Invalid credentials",
          variant: "destructive",
        })
        set({ isLoading: false })
        return false
      }

      localStorage.setItem("token", data.token)
      set({
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role_id === 1,
        isLoading: false,
        isInitialized: true,
      })
      return true
    } catch (error) {
      console.error("Login error:", error)
      set({ isLoading: false })
      return false
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true })
      const { data, error } = await authApi.register(userData)

      if (error || !data) {
        toast({
          title: "Registration failed",
          description: error || "Could not create account",
          variant: "destructive",
        })
        set({ isLoading: false })
        return false
      }

      toast({
        title: "Registration successful",
        description: "Please log in with your new account",
      })
      set({ isLoading: false })
      return true
    } catch (error) {
      console.error("Registration error:", error)
      set({ isLoading: false })
      return false
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      })
    }
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true })
      const token = localStorage.getItem("token")

      if (!token) {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          isInitialized: true,
        })
        return
      }

      const { data, error } = await authApi.getProfile()

      if (error || !data) {
        localStorage.removeItem("token")
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          isInitialized: true,
        })
        return
      }

      set({
        user: data,
        isAuthenticated: true,
        isAdmin: data.role_id === 1,
        isLoading: false,
        isInitialized: true,
      })
    } catch (error) {
      console.error("Fetch user error:", error)
      localStorage.removeItem("token")
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        isInitialized: true,
      })
    }
  },
}))
