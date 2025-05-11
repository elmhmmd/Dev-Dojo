import { create } from "zustand"
import { nodesApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface NodeState {
  nodes: Node[]
  currentNode: Node | null
  objectives: KeyLearningObjective[]
  resources: Resource[]
  isLoading: boolean
  error: string | null

  fetchNodes: (roadmapId: number) => Promise<void>
  fetchNode: (roadmapId: number, nodeId: number) => Promise<void>
  createNode: (roadmapId: number, node: NodeCreateRequest) => Promise<boolean>
  updateNode: (roadmapId: number, nodeId: number, node: NodeUpdateRequest) => Promise<boolean>
  deleteNode: (roadmapId: number, nodeId: number) => Promise<boolean>

  fetchObjectives: (roadmapId: number, nodeId: number) => Promise<void>
  createObjective: (roadmapId: number, nodeId: number, objective: KeyLearningObjectiveCreateRequest) => Promise<boolean>

  fetchResources: (roadmapId: number, nodeId: number) => Promise<void>
  createResource: (roadmapId: number, nodeId: number, resource: ResourceCreateRequest) => Promise<boolean>
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  currentNode: null,
  objectives: [],
  resources: [],
  isLoading: false,
  error: null,

  fetchNodes: async (roadmapId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.getAll(roadmapId)

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ nodes: data, isLoading: false })
    } catch (error) {
      console.error("Fetch nodes error:", error)
      set({ error: "Failed to fetch nodes", isLoading: false })
    }
  },

  fetchNode: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })

     
      const existingNode = get().nodes.find((node) => node.id === nodeId)
      if (existingNode) {
        set({ currentNode: existingNode, isLoading: false })
      } else {
        
        const { data, error } = await nodesApi.getAll(roadmapId)

        if (error || !data) {
          set({ error, isLoading: false })
          return
        }

        const node = data.find((node) => node.id === nodeId) || null
        set({ nodes: data, currentNode: node, isLoading: false })
      }

      
      await get().fetchObjectives(roadmapId, nodeId)
      await get().fetchResources(roadmapId, nodeId)
    } catch (error) {
      console.error("Fetch node error:", error)
      set({ error: "Failed to fetch node", isLoading: false })
    }
  },

  createNode: async (roadmapId, node) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.create(roadmapId, node)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      
      const nodes = get().nodes
      set({ nodes: [...nodes, data], isLoading: false })

      toast({
        title: "Success",
        description: "Node created successfully",
      })

      return true
    } catch (error) {
      console.error("Create node error:", error)
      set({ error: "Failed to create node", isLoading: false })
      return false
    }
  },

  updateNode: async (roadmapId, nodeId, node) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.update(roadmapId, nodeId, node)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

     
      const nodes = get().nodes.map((n) => (n.id === nodeId ? data : n))

      set({
        nodes,
        currentNode: data,
        isLoading: false,
      })

      toast({
        title: "Success",
        description: "Node updated successfully",
      })

      return true
    } catch (error) {
      console.error("Update node error:", error)
      set({ error: "Failed to update node", isLoading: false })
      return false
    }
  },

  deleteNode: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await nodesApi.delete(roadmapId, nodeId)

      if (error) {
        set({ error, isLoading: false })
        return false
      }

      
      const nodes = get().nodes.filter((n) => n.id !== nodeId)
      set({
        nodes,
        currentNode: null,
        isLoading: false,
      })

      toast({
        title: "Success",
        description: "Node deleted successfully",
      })

      return true
    } catch (error) {
      console.error("Delete node error:", error)
      set({ error: "Failed to delete node", isLoading: false })
      return false
    }
  },

  fetchObjectives: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.getObjectives(roadmapId, nodeId)

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ objectives: data, isLoading: false })
    } catch (error) {
      console.error("Fetch objectives error:", error)
      set({ error: "Failed to fetch objectives", isLoading: false })
    }
  },

  createObjective: async (roadmapId, nodeId, objective) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.createObjective(roadmapId, nodeId, objective)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

    
      const objectives = get().objectives
      set({ objectives: [...objectives, data], isLoading: false })

      toast({
        title: "Success",
        description: "Learning objective added successfully",
      })

      return true
    } catch (error) {
      console.error("Create objective error:", error)
      set({ error: "Failed to create objective", isLoading: false })
      return false
    }
  },

  fetchResources: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.getResources(roadmapId, nodeId)

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ resources: data, isLoading: false })
    } catch (error) {
      console.error("Fetch resources error:", error)
      set({ error: "Failed to fetch resources", isLoading: false })
    }
  },

  createResource: async (roadmapId, nodeId, resource) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await nodesApi.createResource(roadmapId, nodeId, resource)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      
      const resources = get().resources
      set({ resources: [...resources, data], isLoading: false })

      toast({
        title: "Success",
        description: "Resource added successfully",
      })

      return true
    } catch (error) {
      console.error("Create resource error:", error)
      set({ error: "Failed to create resource", isLoading: false })
      return false
    }
  },
}))
