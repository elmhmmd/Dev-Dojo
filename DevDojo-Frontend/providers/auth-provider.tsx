"use client"

import type React from "react"
import { useAuthStore } from "@/store/auth-store"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isAdmin, isLoading, isInitialized, fetchUser } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (!isInitialized) return

    
    const publicRoutes = ["/", "/login", "/signup"]
    const isPublicRoute = publicRoutes.some((route) => pathname === route)

   
    const adminRoutes = ["/admin"]
    const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route))

   
    const studentRoutes = ["/dashboard", "/roadmaps"]
    const isStudentRoute = studentRoutes.some((route) => pathname === route || pathname.startsWith(route))

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login")
    } else if (isAuthenticated && isAdminRoute && !isAdmin) {
      router.push("/")
    } else if (isAuthenticated && isStudentRoute && isAdmin) {
      router.push("/admin")
    }
  }, [isAuthenticated, isAdmin, isInitialized, pathname, router])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return <>{children}</>
}
