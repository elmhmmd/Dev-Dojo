import { create } from "zustand"
import { roadmapsApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { Roadmap, RoadmapCreateRequest, RoadmapUpdateRequest } from "@/types/api-types"

interface RoadmapState {
  roadmaps: Roadmap[]
  currentRoadmap: Roadmap | null
  isLoading: boolean
  error: string | null

  fetchRoadmaps: () => Promise<void>
  fetchRoadmap: (id: number) => Promise<void>
  createRoadmap: (roadmap: RoadmapCreateRequest) => Promise<boolean>
  updateRoadmap: (id: number, roadmap: RoadmapUpdateRequest) => Promise<boolean>
  deleteRoadmap: (id: number) => Promise<boolean>
  publishRoadmap: (id: number) => Promise<boolean>
  unpublishRoadmap: (id: number) => Promise<boolean>
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmaps: [],
  currentRoadmap: null,
  isLoading: false,
  error: null,

  fetchRoadmaps: async () => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.getAll()

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ roadmaps: data, isLoading: false })
    } catch (error) {
      console.error("Fetch roadmaps error:", error)
      set({ error: "Failed to fetch roadmaps", isLoading: false })
    }
  },

  fetchRoadmap: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.getById(id)

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ currentRoadmap: data, isLoading: false })
    } catch (error) {
      console.error("Fetch roadmap error:", error)
      set({ error: "Failed to fetch roadmap", isLoading: false })
    }
  },

  createRoadmap: async (roadmap) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.create(roadmap)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      const roadmaps = get().roadmaps
      set({
        roadmaps: [...roadmaps, data],
        isLoading: false,
      })

      toast({
        title: "Success",
        description: "Roadmap created successfully",
      })

      return true
    } catch (error) {
      console.error("Create roadmap error:", error)
      set({ error: "Failed to create roadmap", isLoading: false })
      return false
    }
  },

  updateRoadmap: async (id, roadmap) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.update(id, roadmap)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      const roadmaps = get().roadmaps.map((r) => (r.id === id ? data : r))

      set({
        roadmaps,
        currentRoadmap: data,
        isLoading: false,
      })

      toast({
        title: "Success",
        description: "Roadmap updated successfully",
      })

      return true
    } catch (error) {
      console.error("Update roadmap error:", error)
      set({ error: "Failed to update roadmap", isLoading: false })
      return false
    }
  },

  deleteRoadmap: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await roadmapsApi.delete(id)

      if (error) {
        set({ error, isLoading: false })
        return false
      }

      const roadmaps = get().roadmaps.filter((r) => r.id !== id)
      set({ roadmaps, isLoading: false })

      toast({
        title: "Success",
        description: "Roadmap deleted successfully",
      })

      return true
    } catch (error) {
      console.error("Delete roadmap error:", error)
      set({ error: "Failed to delete roadmap", isLoading: false })
      return false
    }
  },

  publishRoadmap: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.publish(id)

      if (error) {
        set({ error, isLoading: false })
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return false
      }

      const roadmaps = get().roadmaps.map((r) => (r.id === id ? { ...r, published: true } : r))

      const currentRoadmap = get().currentRoadmap
      if (currentRoadmap && currentRoadmap.id === id) {
        set({ currentRoadmap: { ...currentRoadmap, published: true } })
      }

      set({ roadmaps, isLoading: false })

      toast({
        title: "Success",
        description: data?.message || "Roadmap published successfully",
      })

      return true
    } catch (error) {
      console.error("Publish roadmap error:", error)
      set({ error: "Failed to publish roadmap", isLoading: false })
      toast({
        title: "Error",
        description: "Failed to publish roadmap",
        variant: "destructive",
      })
      return false
    }
  },

  unpublishRoadmap: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await roadmapsApi.unpublish(id)

      if (error) {
        set({ error, isLoading: false })
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return false
      }

      
      const roadmaps = get().roadmaps.map((r) => (r.id === id ? { ...r, published: false } : r))

  
      const currentRoadmap = get().currentRoadmap
      if (currentRoadmap && currentRoadmap.id === id) {
        set({ currentRoadmap: { ...currentRoadmap, published: false } })
      }

      set({ roadmaps, isLoading: false })

      toast({
        title: "Success",
        description: data?.message || "Roadmap unpublished successfully",
      })

      return true
    } catch (error) {
      console.error("Unpublish roadmap error:", error)
      set({ error: "Failed to unpublish roadmap", isLoading: false })
      toast({
        title: "Error",
        description: "Failed to unpublish roadmap",
        variant: "destructive",
      })
      return false
    }
  },
}))
