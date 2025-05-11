"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useNodeStore } from "@/store/node-store"
import { useQuizStore } from "@/store/quiz-store"
import { useProjectStore } from "@/store/project-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { KeyLearningObjectiveCreateRequest, ResourceCreateRequest } from "@/types/api-types"

export default function NodeEditPage() {
  const { id, nodeId } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const nodeIdNum = Number.parseInt(nodeId as string)
  const router = useRouter()

  const {
    currentNode,
    objectives,
    resources,
    isLoading: isNodeLoading,
    fetchNode,
    updateNode,
    createObjective,
    createResource,
  } = useNodeStore()

  const { quiz, fetchQuiz, syncQuiz } = useQuizStore()
  const { project, fetchProject, syncProject } = useProjectStore()

  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newObjective, setNewObjective] = useState("")
  const [isAddingObjective, setIsAddingObjective] = useState(false)
  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false)

  const [newResource, setNewResource] = useState("")
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false)

  const [quizTimeLimit, setQuizTimeLimit] = useState<number>(10)
  const [isUpdatingQuiz, setIsUpdatingQuiz] = useState(false)

  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isUpdatingProject, setIsUpdatingProject] = useState(false)

  useEffect(() => {
    if (roadmapId && nodeIdNum) {
      fetchNode(roadmapId, nodeIdNum)
      fetchQuiz(roadmapId, nodeIdNum)
      fetchProject(roadmapId, nodeIdNum)
    }
  }, [roadmapId, nodeIdNum, fetchNode, fetchQuiz, fetchProject])

  useEffect(() => {
    if (currentNode) {
      setTitle(currentNode.title)
      setShortDescription(currentNode.short_description || "")
      setLongDescription(currentNode.long_description || "")
    }
  }, [currentNode])

  useEffect(() => {
    if (quiz) {
      setQuizTimeLimit(quiz.time_limit || 10)
    }
  }, [quiz])

  useEffect(() => {
    if (project) {
      setProjectTitle(project.title)
      setProjectDescription(project.description || "")
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateNode(roadmapId, nodeIdNum, {
        title,
        short_description: shortDescription,
        long_description: longDescription,
      })

      if (success) {
        toast({
          title: "Node updated",
          description: "Your changes have been saved successfully.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddObjective = async () => {
    if (!newObjective.trim()) return

    setIsAddingObjective(true)
    try {
      const objectiveData: KeyLearningObjectiveCreateRequest = {
        body: newObjective,
      }

      const success = await createObjective(roadmapId, nodeIdNum, objectiveData)
      if (success) {
        setNewObjective("")
        setObjectiveDialogOpen(false)
      }
    } finally {
      setIsAddingObjective(false)
    }
  }

  const handleAddResource = async () => {
    if (!newResource.trim()) return

    setIsAddingResource(true)
    try {
      const resourceData: ResourceCreateRequest = {
        link: newResource,
      }

      const success = await createResource(roadmapId, nodeIdNum, resourceData)
      if (success) {
        setNewResource("")
        setResourceDialogOpen(false)
      }
    } finally {
      setIsAddingResource(false)
    }
  }

  const handleUpdateQuiz = async () => {
    setIsUpdatingQuiz(true)
    try {
      const success = await syncQuiz(roadmapId, nodeIdNum, {
        time_limit: quizTimeLimit,
      })

      if (success) {
        toast({
          title: "Quiz updated",
          description: "Quiz settings have been saved successfully.",
        })
      }
    } finally {
      setIsUpdatingQuiz(false)
    }
  }

  const handleUpdateProject = async () => {
    setIsUpdatingProject(true)
    try {
      const success = await syncProject(roadmapId, nodeIdNum, {
        title: projectTitle,
        description: projectDescription,
      })

      if (success) {
        toast({
          title: "Project updated",
          description: "Project settings have been saved successfully.",
        })
      }
    } finally {
      setIsUpdatingProject(false)
    }
  }

  if (isNodeLoading && !currentNode) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentNode) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Node Not Found</h1>
            <p className="text-gray-600 mb-6">
              The node you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href={`/admin/roadmaps/${roadmapId}`}>Back to Roadmap</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href={`/admin/roadmaps/${roadmapId}`}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roadmap
            </Link>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Node Details</TabsTrigger>
              <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
            </TabsList>

            {/* Node Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Edit Node</CardTitle>
                  <CardDescription>Update the node details</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title">Node Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="short-description">Short Description</Label>
                      <Input
                        id="short-description"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="long-description">Long Description</Label>
                      <Textarea
                        id="long-description"
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Learning Objectives Tab */}
            <TabsContent value="objectives">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Learning Objectives</CardTitle>
                    <CardDescription>Define what students will learn in this node</CardDescription>
                  </div>
                  <Dialog open={objectiveDialogOpen} onOpenChange={setObjectiveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Objective
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Learning Objective</DialogTitle>
                        <DialogDescription>Create a new learning objective for this node.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="objective">Objective</Label>
                          <Textarea
                            id="objective"
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                            placeholder="e.g., Understand the basics of HTML structure"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setObjectiveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddObjective} disabled={!newObjective.trim() || isAddingObjective}>
                          {isAddingObjective ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Objective"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {objectives.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No learning objectives added yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click "Add Objective" to create your first learning objective
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {objectives.map((objective) => (
                        <div
                          key={objective.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <p className="text-gray-700">{objective.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Learning Resources</CardTitle>
                    <CardDescription>Add helpful resources for students</CardDescription>
                  </div>
                  <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Resource
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Learning Resource</DialogTitle>
                        <DialogDescription>Add a new learning resource for this node.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="resource">Resource URL</Label>
                          <Input
                            id="resource"
                            type="url"
                            value={newResource}
                            onChange={(e) => setNewResource(e.target.value)}
                            placeholder="e.g., https://example.com/tutorial"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setResourceDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddResource} disabled={!newResource.trim() || isAddingResource}>
                          {isAddingResource ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Resource"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {resources.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No resources added yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click "Add Resource" to add your first learning resource
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {resource.link}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Quiz Settings</CardTitle>
                  <CardDescription>Configure the quiz for this node</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      min="1"
                      max="60"
                      value={quizTimeLimit}
                      onChange={(e) => setQuizTimeLimit(Number.parseInt(e.target.value))}
                      className="mt-1 w-32"
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> After saving the quiz settings, you can add questions and options in the
                      quiz editor.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/roadmaps/${roadmapId}/nodes/${nodeIdNum}/quiz`)}
                    disabled={!quiz}
                  >
                    Edit Questions
                  </Button>
                  <Button onClick={handleUpdateQuiz} disabled={isUpdatingQuiz}>
                    {isUpdatingQuiz ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Quiz Settings"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Project Tab */}
            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Settings</CardTitle>
                  <CardDescription>Configure the project for this node</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g., Build a Responsive Website"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-description">Project Description</Label>
                    <Textarea
                      id="project-description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe the project requirements and objectives"
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdateProject} disabled={isUpdatingProject}>
                    {isUpdatingProject ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Project Settings"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
