import { toast } from "@/components/ui/use-toast"
import type {
  AdminStatistics,
  KeyLearningObjective,
  KeyLearningObjectiveCreateRequest,
  LoginRequest,
  Node,
  NodeCreateRequest,
  NodeUpdateRequest,
  Option,
  OptionsSyncRequest,
  Project,
  ProjectSubmission,
  ProjectSubmitRequest,
  ProjectSyncRequest,
  Question,
  QuestionsSyncRequest,
  Quiz,
  QuizSubmitRequest,
  QuizSubmitResponse,
  QuizSyncRequest,
  RegisterRequest,
  Resource,
  ResourceCreateRequest,
  Roadmap,
  RoadmapCreateRequest,
  RoadmapProgress,
  RoadmapUpdateRequest,
  StudentStatistics,
  User,
} from "@/types/api-types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  status: number
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const status = response.status

    if (status === 401) {
      
      localStorage.removeItem("token")
      window.location.href = "/login"
      return { data: null, error: "Unauthorized access", status }
    }

    if (status === 403) {
      return { data: null, error: "Forbidden access", status }
    }

    if (status === 404) {
      return { data: null, error: "Resource not found", status }
    }

    const data = await response.json()

    if (!response.ok) {
      if (data.message && data.errors) {
        const errorMessages = Object.values(data.errors).flat() as string[]
        toast({
          title: data.message,
          description: errorMessages.join(", "),
          variant: "destructive",
        })
      }
      return { data: null, error: data.error || data.message || "An error occurred", status }
    }

    return { data: data as T, error: null, status }
  } catch (error) {
    console.error("API request failed:", error)
    return { data: null, error: "Network error", status: 0 }
  }
}


export const authApi = {
  register: async (userData: RegisterRequest) => {
    return fetchApi<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: LoginRequest) => {
    return fetchApi<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  logout: async () => {
    return fetchApi("/auth/logout", {
      method: "POST",
    })
  },

  getProfile: async () => {
    return fetchApi<User>("/auth/me")
  },
}


export const roadmapsApi = {
  getAll: async () => {
    return fetchApi<Roadmap[]>("/roadmaps")
  },

  getById: async (id: number) => {
    return fetchApi<Roadmap>(`/roadmaps/${id}`)
  },

  create: async (roadmap: RoadmapCreateRequest) => {
    return fetchApi<Roadmap>("/roadmaps", {
      method: "POST",
      body: JSON.stringify(roadmap),
    })
  },

  update: async (id: number, roadmap: RoadmapUpdateRequest) => {
    return fetchApi<Roadmap>(`/roadmaps/${id}`, {
      method: "PUT",
      body: JSON.stringify(roadmap),
    })
  },

  delete: async (id: number) => {
    return fetchApi(`/roadmaps/${id}`, {
      method: "DELETE",
    })
  },

  publish: async (id: number) => {
    return fetchApi(`/roadmaps/${id}/publish`, {
      method: "POST",
    })
  },

  unpublish: async (id: number) => {
    return fetchApi(`/roadmaps/${id}/unpublish`, {
      method: "POST",
    })
  },

  getProgress: async (id: number) => {
    return fetchApi<RoadmapProgress>(`/roadmaps/${id}/progress`)
  },
}


export const nodesApi = {
  getAll: async (roadmapId: number) => {
    return fetchApi<Node[]>(`/roadmaps/${roadmapId}/nodes`)
  },

  create: async (roadmapId: number, node: NodeCreateRequest) => {
    return fetchApi<Node>(`/roadmaps/${roadmapId}/nodes`, {
      method: "POST",
      body: JSON.stringify(node),
    })
  },

  update: async (roadmapId: number, nodeId: number, node: NodeUpdateRequest) => {
    return fetchApi<Node>(`/roadmaps/${roadmapId}/nodes/${nodeId}`, {
      method: "PUT",
      body: JSON.stringify(node),
    })
  },

  delete: async (roadmapId: number, nodeId: number) => {
    return fetchApi(`/roadmaps/${roadmapId}/nodes/${nodeId}`, {
      method: "DELETE",
    })
  },

  
  getObjectives: async (roadmapId: number, nodeId: number) => {
    return fetchApi<KeyLearningObjective[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/key-learning-objectives`)
  },

  createObjective: async (roadmapId: number, nodeId: number, objective: KeyLearningObjectiveCreateRequest) => {
    return fetchApi<KeyLearningObjective>(`/roadmaps/${roadmapId}/nodes/${nodeId}/key-learning-objectives`, {
      method: "POST",
      body: JSON.stringify(objective),
    })
  },

  
  getResources: async (roadmapId: number, nodeId: number) => {
    return fetchApi<Resource[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/resources`)
  },

  createResource: async (roadmapId: number, nodeId: number, resource: ResourceCreateRequest) => {
    return fetchApi<Resource>(`/roadmaps/${roadmapId}/nodes/${nodeId}/resources`, {
      method: "POST",
      body: JSON.stringify(resource),
    })
  },
}


export const quizApi = {
  getQuiz: async (roadmapId: number, nodeId: number) => {
    return fetchApi<Quiz>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz`)
  },

  syncQuiz: async (roadmapId: number, nodeId: number, quiz: QuizSyncRequest) => {
    return fetchApi<Quiz>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz`, {
      method: "PUT",
      body: JSON.stringify(quiz),
    })
  },

  getQuestions: async (roadmapId: number, nodeId: number, quizId: number) => {
    return fetchApi<Question[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/questions`)
  },

  syncQuestions: async (roadmapId: number, nodeId: number, quizId: number, questions: QuestionsSyncRequest) => {
    return fetchApi<Question[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/questions`, {
      method: "PUT",
      body: JSON.stringify(questions),
    })
  },

  getOptions: async (roadmapId: number, nodeId: number, quizId: number, questionId: number) => {
    return fetchApi<Option[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/questions/${questionId}/options`)
  },

  syncOptions: async (
    roadmapId: number,
    nodeId: number,
    quizId: number,
    questionId: number,
    options: OptionsSyncRequest,
  ) => {
    return fetchApi<Option[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/questions/${questionId}/options`, {
      method: "PUT",
      body: JSON.stringify(options),
    })
  },

  submitQuiz: async (roadmapId: number, nodeId: number, quizId: number, answers: QuizSubmitRequest) => {
    return fetchApi<QuizSubmitResponse>(`/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify(answers),
    })
  },
}


export const projectApi = {
  getProject: async (roadmapId: number, nodeId: number) => {
    return fetchApi<Project>(`/roadmaps/${roadmapId}/nodes/${nodeId}/project`)
  },

  getSubmissions: async (roadmapId: number, nodeId: number, projectId: number) => {
    return fetchApi<ProjectSubmission[]>(`/roadmaps/${roadmapId}/nodes/${nodeId}/project/${projectId}/submissions`)
  },

  syncProject: async (roadmapId: number, nodeId: number, project: ProjectSyncRequest) => {
    return fetchApi<Project>(`/roadmaps/${roadmapId}/nodes/${nodeId}/project`, {
      method: "PUT",
      body: JSON.stringify(project),
    })
  },

  submitProject: async (roadmapId: number, nodeId: number, projectId: number, submission: ProjectSubmitRequest) => {
    return fetchApi<ProjectSubmission>(`/roadmaps/${roadmapId}/nodes/${nodeId}/project/${projectId}/submit`, {
      method: "POST",
      body: JSON.stringify(submission),
    })
  },

  upvoteSubmission: async (roadmapId: number, nodeId: number, projectId: number, submissionId: number) => {
    return fetchApi<{ message: string; new_score: number }>(
      `/roadmaps/${roadmapId}/nodes/${nodeId}/project/${projectId}/submissions/${submissionId}/upvote`,
      {
        method: "POST",
      },
    )
  },
}


export const statsApi = {
  getAdminStats: async () => {
    return fetchApi<AdminStatistics>("/admin/statistics")
  },

  getStudentStats: async () => {
    return fetchApi<StudentStatistics>("/statistics")
  },
}
