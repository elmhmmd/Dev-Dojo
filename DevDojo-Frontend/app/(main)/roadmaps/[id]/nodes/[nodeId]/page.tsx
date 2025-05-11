"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useNodeStore } from "@/store/node-store"
import { useQuizStore } from "@/store/quiz-store"
import { useProjectStore } from "@/store/project-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CheckCircle, ExternalLink, PaintbrushIcon as PaintBrush } from "lucide-react"
import Link from "next/link"

export default function NodePage() {
  const { id, nodeId } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const nodeIdNum = Number.parseInt(nodeId as string)
  const router = useRouter()

  const { currentNode, objectives, resources, isLoading, fetchNode } = useNodeStore()
  const { fetchQuiz, quiz } = useQuizStore()
  const { fetchProject, project } = useProjectStore()

  useEffect(() => {
    if (roadmapId && nodeIdNum) {
      fetchNode(roadmapId, nodeIdNum)
      fetchQuiz(roadmapId, nodeIdNum)
      fetchProject(roadmapId, nodeIdNum)
    }
  }, [roadmapId, nodeIdNum, fetchNode, fetchQuiz, fetchProject])

  const getNodeIcon = () => {
    if (!currentNode) return <PaintBrush className="text-purple-600 text-xl" />

    const title = currentNode.title.toLowerCase()
    if (title.includes("css") || title.includes("design")) {
      return <PaintBrush className="text-purple-600 text-xl" />
    }

    return <PaintBrush className="text-purple-600 text-xl" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-purple-600 hover:text-purple-500">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roadmap
          </Button>
        </div>

        {/* Node Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {isLoading ? (
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
              </div>
            ) : currentNode ? (
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">{getNodeIcon()}</div>
                <div className="ml-4 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{currentNode.title}</h1>
                  <p className="text-sm text-gray-500">{currentNode.short_description}</p>
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Node not found</h1>
                <p className="text-sm text-gray-500">The node you're looking for doesn't exist or isn't available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Node Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg mt-8" />
              </div>
              <div>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            </div>
          ) : currentNode ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
                  <p className="text-gray-700">
                    {currentNode.long_description || "No description available for this node."}
                  </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Learning Objectives</h2>
                  {objectives.length > 0 ? (
                    <ul className="space-y-3">
                      {objectives.map((objective) => (
                        <li key={objective.id} className="flex items-start">
                          <CheckCircle className="text-green-500 mt-1 mr-2 h-5 w-5" />
                          <span className="text-gray-700">{objective.body}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No learning objectives defined for this node.</p>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Resources</h2>
                  {resources.length > 0 ? (
                    <ul className="space-y-4">
                      {resources.map((resource) => (
                        <li key={resource.id}>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-500 flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {resource.link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No resources available for this node.</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                        <CheckCircle className="text-purple-600 h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Assessments</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Quiz</h4>
                        </div>
                        <div>
                          {quiz ? (
                            <Link href={`/roadmaps/${roadmapId}/nodes/${nodeIdNum}/quiz/${quiz.id}`}>
                              <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-gray-400">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Project</h4>
                        </div>
                        <div>
                          {project ? (
                            <Link href={`/roadmaps/${roadmapId}/nodes/${nodeIdNum}/project/${project.id}`}>
                              <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-gray-400">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Node not found</h3>
              <p className="mt-2 text-sm text-gray-500">
                The node you're looking for doesn't exist or isn't available.
              </p>
              <Button className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
