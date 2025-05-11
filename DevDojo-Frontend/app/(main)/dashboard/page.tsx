"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useStatsStore } from "@/store/stats-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Code, ThumbsUp, Trophy } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { studentStats, fetchStudentStats } = useStatsStore()

  useEffect(() => {
    fetchStudentStats()
  }, [fetchStudentStats])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Dashboard Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl text-purple-600">{user?.username ? getInitials(user.username) : "U"}</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user?.username || "Student"}</h1>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Completed Nodes */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <CheckCircle className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Nodes</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {studentStats?.total_nodes_completed || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Roadmaps */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Trophy className="text-blue-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Roadmaps</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {studentStats?.total_roadmaps_completed || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Quizzes Completed */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <CheckCircle className="text-yellow-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Quizzes Passed</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{studentStats?.quizzes_passed || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Submitted */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Code className="text-indigo-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Projects Completed</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{studentStats?.projects_completed || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Upvotes */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <ThumbsUp className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Upvotes</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {studentStats?.total_upvotes_gained || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Roadmaps CTA */}
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to continue learning?</h2>
            <p className="text-gray-600 mb-4">Explore available roadmaps and continue your learning journey.</p>
            <Link href="/roadmaps">
              <Button>Browse Roadmaps</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
