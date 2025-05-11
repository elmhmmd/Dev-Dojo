"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRoadmapStore } from "@/store/roadmap-store"
import { useNodeStore } from "@/store/node-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Loader2, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import type { NodeCreateRequest } from "@/types/api-types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditRoadmapPage() {
  const { id } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const router = useRouter()

  const {
    currentRoadmap,
    isLoading: isRoadmapLoading,
    fetchRoadmap,
    updateRoadmap,
    publishRoadmap,
    unpublishRoadmap,
    deleteRoadmap,
  } = useRoadmapStore()
  const { nodes, isLoading: isNodesLoading, fetchNodes, createNode, deleteNode } = useNodeStore()

  const [title, setTitle] = useState("")
  const [published, setPublished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [newNodeTitle, setNewNodeTitle] = useState("")
  const [newNodeShortDesc, setNewNodeShortDesc] = useState("")
  const [newNodeLongDesc, setNewNodeLongDesc] = useState("")
  const [isAddingNode, setIsAddingNode] = useState(false)
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false)

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmap(roadmapId)
      fetchNodes(roadmapId)
    }
  }, [roadmapId, fetchRoadmap, fetchNodes])

  useEffect(() => {
    if (currentRoadmap) {
      setTitle(currentRoadmap.title)
      setPublished(currentRoadmap.published)
    }
  }, [currentRoadmap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateRoadmap(roadmapId, { title, published })
      if (success) {
        toast({
          title: "Roadmap updated",
          description: "Your changes have been saved successfully.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const success = await publishRoadmap(roadmapId)
      if (success) {
        setPublished(true)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setIsUnpublishing(true)
    try {
      const success = await unpublishRoadmap(roadmapId)
      if (success) {
        setPublished(false)
      }
    } finally {
      setIsUnpublishing(false)
    }
  }

  const handleAddNode = async () => {
    setIsAddingNode(true)
    try {
      const nodeData: NodeCreateRequest = {
        title: newNodeTitle,
        short_description: newNodeShortDesc || undefined,
        long_description: newNodeLongDesc || undefined,
      }

      const success = await createNode(roadmapId, nodeData)
      if (success) {
        setNewNodeTitle("")
        setNewNodeShortDesc("")
        setNewNodeLongDesc("")
        setNodeDialogOpen(false)
        toast({
          title: "Node added",
          description: "The node has been added to the roadmap.",
        })
      }
    } finally {
      setIsAddingNode(false)
    }
  }

  const [nodeToDelete, setNodeToDelete] = useState<number | null>(null)
  const [isDeletingNode, setIsDeletingNode] = useState(false)

  const handleDeleteNode = async () => {
    if (!nodeToDelete) return

    setIsDeletingNode(true)
    try {
      await deleteNode(roadmapId, nodeToDelete)
      setNodeToDelete(null)
    } finally {
      setIsDeletingNode(false)
    }
  }

  const handleDeleteRoadmap = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteRoadmap(roadmapId)
      if (success) {
        router.push("/admin")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (isRoadmapLoading && !currentRoadmap) {
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

  if (!currentRoadmap) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Roadmap Not Found</h1>
            <p className="text-gray-600 mb-6">
              The roadmap you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/admin">Back to Dashboard</Link>
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
          <div className="mb-8 flex justify-between items-center">
            <Link href="/admin" className="flex items-center text-purple-600 hover:text-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              {published ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" /> Published
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <X className="mr-1 h-3 w-3" /> Draft
                </span>
              )}
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Roadmap Details</TabsTrigger>
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Edit Roadmap</CardTitle>
                  <CardDescription>Update your roadmap details and publishing status</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title">Roadmap Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="published" checked={published} onCheckedChange={setPublished} />
                      <Label htmlFor="published">Published</Label>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Publishing a roadmap makes it visible to all students. Make sure you've
                        added all necessary nodes, quizzes, and projects before publishing.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      {published ? (
                        <Button type="button" variant="outline" onClick={handleUnpublish} disabled={isUnpublishing}>
                          {isUnpublishing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Unpublishing...
                            </>
                          ) : (
                            "Unpublish Roadmap"
                          )}
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" onClick={handlePublish} disabled={isPublishing}>
                          {isPublishing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            "Publish Roadmap"
                          )}
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete Roadmap</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the roadmap and all its
                              associated nodes, quizzes, and projects.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteRoadmap} disabled={isDeleting}>
                              {isDeleting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

            <TabsContent value="nodes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Roadmap Nodes</CardTitle>
                    <CardDescription>Manage the learning nodes in this roadmap</CardDescription>
                  </div>
                  <Dialog open={nodeDialogOpen} onOpenChange={setNodeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Node
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Node</DialogTitle>
                        <DialogDescription>Create a new learning node for this roadmap.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="node-title">Node Title</Label>
                          <Input
                            id="node-title"
                            value={newNodeTitle}
                            onChange={(e) => setNewNodeTitle(e.target.value)}
                            placeholder="e.g., Introduction to HTML"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="node-short-desc">Short Description</Label>
                          <Input
                            id="node-short-desc"
                            value={newNodeShortDesc}
                            onChange={(e) => setNewNodeShortDesc(e.target.value)}
                            placeholder="Brief description of this node"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="node-long-desc">Long Description</Label>
                          <Textarea
                            id="node-long-desc"
                            value={newNodeLongDesc}
                            onChange={(e) => setNewNodeLongDesc(e.target.value)}
                            placeholder="Detailed description of what students will learn"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNodeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddNode} disabled={!newNodeTitle || isAddingNode}>
                          {isAddingNode ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Node"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isNodesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                  ) : nodes.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No nodes added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Add Node" to create your first learning node</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {nodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{node.title}</h3>
                            {node.short_description && (
                              <p className="text-sm text-gray-500 mt-1">{node.short_description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/roadmaps/${roadmapId}/nodes/${node.id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setNodeToDelete(node.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <AlertDialog open={!!nodeToDelete} onOpenChange={(open) => !open && setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Node</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this node? This action cannot be undone and will remove all associated
              quizzes and projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNode} disabled={isDeletingNode}>
              {isDeletingNode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
