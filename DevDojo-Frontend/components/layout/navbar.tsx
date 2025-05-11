"use client"

import { useAuthStore } from "@/store/auth-store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, isInitialized } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  if (!isInitialized) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                DevDojo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              DevDojo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link
                      href="/roadmaps"
                      className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Roadmaps
                    </Link>

                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        {user?.username ? getInitials(user.username) : "U"}
                      </div>
                      <span>{user?.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-gray-600 hover:text-purple-600">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link
                      href="/roadmaps"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Roadmaps
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                <div className="px-3 py-2 flex items-center justify-between text-gray-700">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      {user?.username ? getInitials(user.username) : "U"}
                    </div>
                    <span className="ml-2">{user?.username}</span>
                  </div>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
