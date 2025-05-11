import { create } from "zustand"
import { projectApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { Project, ProjectSubmission } from "@/types/api-types"

interface ProjectState {
  project: Project | null
  submissions: ProjectSubmission[]
  isLoading: boolean
  error: string | null

  fetchProject: (roadmapId: number, nodeId: number) => Promise<void>
  fetchSubmissions: (roadmapId: number, nodeId: number, projectId: number) => Promise<void>
  syncProject: (roadmapId: number, nodeId: number, project: { title: string; description?: string }) => Promise<boolean>
  submitProject: (
    roadmapId: number,
    nodeId: number,
    projectId: number,
    submission: { link: string },
  ) => Promise<boolean>
  upvoteSubmission: (roadmapId: number, nodeId: number, projectId: number, submissionId: number) => Promise<boolean>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  submissions: [],
  isLoading: false,
  error: null,

  fetchProject: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await projectApi.getProject(roadmapId, nodeId)

      if (error) {
        set({ error, isLoading: false })
        return
      }

      set({ project: data, isLoading: false })

      
      if (data && data.id) {
        await get().fetchSubmissions(roadmapId, nodeId, data.id)
      }
    } catch (error) {
      console.error("Fetch project error:", error)
      set({ error: "Failed to fetch project", isLoading: false })
    }
  },

  fetchSubmissions: async (roadmapId, nodeId, projectId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await projectApi.getSubmissions(roadmapId, nodeId, projectId)

      if (error) {
        set({ error, isLoading: false })
        return
      }

      set({ submissions: data || [], isLoading: false })
    } catch (error) {
      console.error("Fetch submissions error:", error)
      set({ error: "Failed to fetch project submissions", isLoading: false })
    }
  },

  syncProject: async (roadmapId, nodeId, project) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await projectApi.syncProject(roadmapId, nodeId, project)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      set({ project: data, isLoading: false })

      toast({
        title: "Success",
        description: "Project updated successfully",
      })

      return true
    } catch (error) {
      console.error("Sync project error:", error)
      set({ error: "Failed to update project", isLoading: false })
      return false
    }
  },

  submitProject: async (roadmapId, nodeId, projectId, submission) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await projectApi.submitProject(roadmapId, nodeId, projectId, submission)

      if (error || !data) {
        set({ error, isLoading: false })
        toast({
          title: "Error",
          description: error || "Failed to submit project",
          variant: "destructive",
        })
        return false
      }

      
      await get().fetchSubmissions(roadmapId, nodeId, projectId)

      toast({
        title: "Success",
        description: "Project submitted successfully",
      })

      return true
    } catch (error) {
      console.error("Submit project error:", error)
      set({ error: "Failed to submit project", isLoading: false })
      return false
    }
  },

  upvoteSubmission: async (roadmapId, nodeId, projectId, submissionId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await projectApi.upvoteSubmission(roadmapId, nodeId, projectId, submissionId)

      if (error) {
        set({ error, isLoading: false })
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return false
      }

     
      const submissions = get().submissions.map((s) => {
        if (s.id === submissionId) {
          return { ...s, score: data?.new_score || s.score + 1 }
        }
        return s
      })

      set({ submissions, isLoading: false })

      toast({
        title: "Success",
        description: "Upvote recorded successfully",
      })

      return true
    } catch (error) {
      console.error("Upvote submission error:", error)
      set({ error: "Failed to upvote submission", isLoading: false })
      toast({
        title: "Error",
        description: "Failed to upvote submission",
        variant: "destructive",
      })
      return false
    }
  },
}))
