"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProjectStore } from "@/store/project-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Code, Github, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function ProjectPage() {
  const { id, nodeId, projectId } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const nodeIdNum = Number.parseInt(nodeId as string)
  const projectIdNum = Number.parseInt(projectId as string)
  const router = useRouter()

  const { project, submissions, isLoading, fetchProject, submitProject, upvoteSubmission } = useProjectStore()
  const [projectLink, setProjectLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (roadmapId && nodeIdNum) {
      fetchProject(roadmapId, nodeIdNum)
    }
  }, [roadmapId, nodeIdNum, fetchProject])

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectLink) {
      toast({
        title: "Error",
        description: "Please enter a project link",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitProject(roadmapId, nodeIdNum, projectIdNum, { link: projectLink })
      setProjectLink("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpvote = async (submissionId: number) => {
    await upvoteSubmission(roadmapId, nodeIdNum, projectIdNum, submissionId)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-16 w-full rounded-lg mb-8" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-purple-600 hover:text-purple-500 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="bg-white shadow rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
              <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or isn't available.</p>
              <Link href={`/roadmaps/${roadmapId}/nodes/${nodeId}`}>
                <Button>Back to Node</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Project Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Code className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-sm text-gray-500">
                  {project.description || "Build a project to demonstrate your skills"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Tabs */}
            <Tabs defaultValue="details">
              <div className="border-b border-gray-200">
                <TabsList className="h-auto p-0">
                  <TabsTrigger
                    value="details"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 py-4 px-6"
                  >
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="submissions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 py-4 px-6"
                  >
                    Project Submissions
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Project Details Tab Content */}
              <TabsContent value="details" className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{project.title} Challenge</h2>

                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {project.description ||
                      "In this project, you'll build a practical application to demonstrate your skills."}
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Requirements:</h3>

                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Create a functional application that meets the project objectives</li>
                    <li>Implement best practices for code organization and readability</li>
                    <li>Ensure your solution is responsive and works across different devices</li>
                    <li>Include appropriate error handling and validation</li>
                    <li>Document your code and provide clear instructions for running the project</li>
                  </ul>

                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Submission Guidelines:</h3>

                  <p className="mb-4">Submit your solution as a GitHub repository with the following:</p>

                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Source code for your project</li>
                    <li>A README.md file explaining your approach and any challenges you faced</li>
                    <li>Screenshots or demo of your solution</li>
                    <li>Instructions for running the project locally</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleSubmitProject}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="url"
                        placeholder="Enter your project GitHub URL"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        required
                        className="flex-grow"
                      />
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Project"}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* Project Submissions Tab Content */}
              <TabsContent value="submissions" className="p-6">
                <div className="space-y-6">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600">{submission.student_id.toString().substring(0, 2)}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              Student {submission.student_id} submitted their solution
                            </p>
                            <a
                              href={submission.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-1 text-sm text-purple-600 hover:text-purple-500"
                            >
                              <Github className="mr-1 h-4 w-4" /> Visit Solution
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpvote(submission.id)}
                            className="flex items-center text-gray-500 hover:text-purple-600"
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            <span>{submission.score}</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No submissions yet. Be the first to submit your project!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
