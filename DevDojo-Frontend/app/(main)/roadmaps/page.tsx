"use client"

import { useEffect } from "react"
import { useRoadmapStore } from "@/store/roadmap-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code, Database, GamepadIcon, Monitor, Server, Shield } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function RoadmapsPage() {
  const { roadmaps, isLoading, fetchRoadmaps } = useRoadmapStore()

  useEffect(() => {
    fetchRoadmaps()
  }, [fetchRoadmaps])

  const getIconForRoadmap = (title: string) => {
    const titleLower = title.toLowerCase()

    if (titleLower.includes("web") || titleLower.includes("full-stack")) {
      return <Code className="h-6 w-6" />
    } else if (titleLower.includes("mobile")) {
      return <Monitor className="h-6 w-6" />
    } else if (titleLower.includes("data")) {
      return <Database className="h-6 w-6" />
    } else if (titleLower.includes("devops") || titleLower.includes("cloud")) {
      return <Server className="h-6 w-6" />
    } else if (titleLower.includes("security") || titleLower.includes("cyber")) {
      return <Shield className="h-6 w-6" />
    } else if (titleLower.includes("game")) {
      return <GamepadIcon className="h-6 w-6" />
    } else {
      return <Code className="h-6 w-6" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Roadmaps</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-6">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="ml-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mt-6" />
                  <Skeleton className="h-10 w-32 mt-6" />
                </div>
              ))}
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No roadmaps available</h3>
              <p className="mt-2 text-sm text-gray-500">Check back later for new learning paths</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roadmaps
                .map((roadmap) => (
                  <div key={roadmap.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-600 rounded-md p-3 text-white">
                          {getIconForRoadmap(roadmap.title)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{roadmap.title}</h3>
                          <p className="text-sm text-gray-500">Master essential skills</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-gray-600">
                          Learn everything you need to become proficient in {roadmap.title.toLowerCase()}.
                        </p>
                      </div>
                      <div className="mt-6">
                        <Link href={`/roadmaps/${roadmap.id}`}>
                          <Button className="w-full sm:w-auto">View Roadmap</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
