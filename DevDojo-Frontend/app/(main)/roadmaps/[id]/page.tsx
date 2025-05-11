"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRoadmapStore } from "@/store/roadmap-store"
import { useAuthStore } from "@/store/auth-store"
import { roadmapsApi } from "@/lib/api"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, Code, Database, PaintbrushIcon as PaintBrush } from "lucide-react"
import Link from "next/link"
import type { Node, RoadmapProgress } from "@/types/api-types"

export default function RoadmapPage() {
  const { id } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const { currentRoadmap, fetchRoadmap, isLoading } = useRoadmapStore()
  const { isAuthenticated } = useAuthStore()
  const [progress, setProgress] = useState<RoadmapProgress | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmap(roadmapId)
    }
  }, [roadmapId, fetchRoadmap])

  useEffect(() => {
    const fetchProgress = async () => {
      if (isAuthenticated && roadmapId) {
        try {
          const { data } = await roadmapsApi.getProgress(roadmapId)
          if (data) {
            setProgress(data)
          }
        } catch (error) {
          console.error("Error fetching progress:", error)
        }
      }
    }

    fetchProgress()
  }, [isAuthenticated, roadmapId])

  const getNodeIcon = (node: Node) => {
    const title = node.title.toLowerCase()

    if (title.includes("html") || title.includes("javascript") || title.includes("react")) {
      return <Code className="text-white text-xl" />
    } else if (title.includes("css") || title.includes("design")) {
      return <PaintBrush className="text-white text-xl" />
    } else if (title.includes("database") || title.includes("sql")) {
      return <Database className="text-white text-xl" />
    } else {
      return <Code className="text-white text-xl" />
    }
  }

  const getNodeStatus = (node: Node) => {
    return node.completion ? "completed" : "incomplete"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Progress Overview */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {isLoading ? (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full md:w-48 mt-2" />
                </div>
              </div>
            ) : currentRoadmap ? (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentRoadmap.title}</h1>
                  <p className="mt-1 text-gray-600">Your personalized learning journey</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  {progress ? (
                    <div className="mt-2 flex items-center justify-end">
                      <div className="w-48 h-4 bg-gray-200 rounded-full mr-2">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${progress.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(progress.progress_percentage)}% Complete
                      </span>
                    </div>
                  ) : isAuthenticated ? (
                    <Button
                      onClick={() =>
                        toast({ title: "Already joined", description: "You are already enrolled in this roadmap" })
                      }
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button>Sign in to join</Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Roadmap not found</h1>
                <p className="mt-1 text-gray-600">
                  The roadmap you're looking for doesn't exist or isn't published yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="space-y-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-1 mr-4">
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 ml-4">
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : currentRoadmap && currentRoadmap.nodes && currentRoadmap.nodes.length > 0 ? (
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute inset-0 flex flex-col items-center">
                <div className="h-full w-0.5 bg-gray-200"></div>
              </div>

              {/* Nodes */}
              <div className="relative space-y-16">
                {currentRoadmap.nodes.map((node, index) => {
                  const nodeStatus = getNodeStatus(node)
                  const isEven = index % 2 === 0

                  let statusBadge
                  let nodeColor

                  if (nodeStatus === "completed") {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" /> Completed
                      </span>
                    )
                    nodeColor = "bg-green-500"
                  } else {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="mr-1 h-3 w-3" /> Not Completed
                      </span>
                    )
                    nodeColor = "bg-purple-500"
                  }

                  return (
                    <div key={node.id} className="group">
                      <div className="flex items-center">
                        {isEven ? (
                          <>
                            <div className="flex-1 mr-4 text-right">
                              <div className="group-hover:bg-gray-50 p-4 rounded-lg transition-all duration-200">
                                <h3 className="text-lg font-medium text-gray-900">{node.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{node.short_description}</p>
                                <div className="mt-3 flex justify-end space-x-2">{statusBadge}</div>
                              </div>
                            </div>
                            <Link href={`/roadmaps/${roadmapId}/nodes/${node.id}`} className="relative z-10">
                              <div
                                className={`w-12 h-12 rounded-full ${nodeColor} flex items-center justify-center shadow-lg cursor-pointer hover:opacity-90 transition-opacity`}
                              >
                                {getNodeIcon(node)}
                              </div>
                            </Link>
                            <div className="flex-1 ml-4"></div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 mr-4"></div>
                            <Link href={`/roadmaps/${roadmapId}/nodes/${node.id}`} className="relative z-10">
                              <div
                                className={`w-12 h-12 rounded-full ${nodeColor} flex items-center justify-center shadow-lg cursor-pointer hover:opacity-90 transition-opacity`}
                              >
                                {getNodeIcon(node)}
                              </div>
                            </Link>
                            <div className="flex-1 ml-4">
                              <div className="group-hover:bg-gray-50 p-4 rounded-lg transition-all duration-200">
                                <h3 className="text-lg font-medium text-gray-900">{node.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{node.short_description}</p>
                                <div className="mt-3 flex space-x-2">{statusBadge}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No nodes available</h3>
              <p className="mt-2 text-sm text-gray-500">This roadmap doesn't have any content yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
