import { create } from "zustand"
import { statsApi } from "@/lib/api"

interface AdminStatistics {
  totalUsers: number
  activeUsers: number
  totalCourses: number
}

interface StudentStatistics {
  coursesEnrolled: number
  coursesCompleted: number
  averageScore: number
}

interface StatsState {
  adminStats: AdminStatistics | null
  studentStats: StudentStatistics | null
  isLoading: boolean
  error: string | null

  fetchAdminStats: () => Promise<void>
  fetchStudentStats: () => Promise<void>
}

export const useStatsStore = create<StatsState>((set) => ({
  adminStats: null,
  studentStats: null,
  isLoading: false,
  error: null,

  fetchAdminStats: async () => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await statsApi.getAdminStats()

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ adminStats: data, isLoading: false })
    } catch (error) {
      console.error("Fetch admin stats error:", error)
      set({ error: "Failed to fetch admin statistics", isLoading: false })
    }
  },

  fetchStudentStats: async () => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await statsApi.getStudentStats()

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ studentStats: data, isLoading: false })
    } catch (error) {
      console.error("Fetch student stats error:", error)
      set({ error: "Failed to fetch student statistics", isLoading: false })
    }
  },
}))
