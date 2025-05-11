"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useRoadmapStore } from "@/store/roadmap-store"
import { useStatsStore } from "@/store/stats-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code, MapPin, Plus, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const { isAdmin } = useAuthStore()
  const { roadmaps, fetchRoadmaps } = useRoadmapStore()
  const { adminStats, fetchAdminStats } = useStatsStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    fetchRoadmaps()
    fetchAdminStats()
  }, [isAdmin, router, fetchRoadmaps, fetchAdminStats])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Dashboard Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage platform content and settings</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            {/* Total Students */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <UserCheck className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{adminStats?.total_students || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmaps */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <MapPin className="text-yellow-600 h-5 w-5" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Roadmaps</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{adminStats?.total_roadmaps || 0}</div>
                        <div className="text-sm text-gray-500">
                          <span className="text-green-500">{adminStats?.published_roadmaps || 0} Published</span> •
                          <span className="text-gray-500"> {adminStats?.unpublished_roadmaps || 0} Unpublished</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Roadmaps Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Manage Roadmaps</h3>
                <p className="mt-1 text-sm text-gray-500">Create and manage learning roadmaps</p>
              </div>
              <Link href="/admin/roadmaps/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create Roadmap
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              {roadmaps.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Roadmap
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roadmaps.map((roadmap) => (
                      <tr key={roadmap.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                              <Code className="text-purple-600 h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{roadmap.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              roadmap.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {roadmap.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/roadmaps/${roadmap.id}`}>
                            <Button variant="link" className="text-purple-600 hover:text-purple-900">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No roadmaps available.</p>
                  <Link href="/admin/roadmaps/new">
                    <Button className="mt-4">Create Your First Roadmap</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
