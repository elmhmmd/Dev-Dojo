import { create } from "zustand"
import { quizApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface Quiz {
  id: number
  title: string
  description: string
  time_limit: number
}

interface Question {
  id: number
  quiz_id: number
  text: string
  options: Option[]
}

interface Option {
  id: number
  question_id: number
  text: string
  is_correct: boolean
}

interface QuizSubmitResponse {
  passed: boolean
  message: string
  score: number
  total_questions: number
}

interface QuizSyncRequest {
  title: string
  description: string
  time_limit: number
}

interface QuestionsSyncRequest {
  questions: Question[]
}

interface QuizState {
  quiz: Quiz | null
  questions: Question[]
  currentQuestionIndex: number
  selectedAnswers: Record<number, number>
  timeRemaining: number | null
  isLoading: boolean
  error: string | null
  quizResult: QuizSubmitResponse | null

  fetchQuiz: (roadmapId: number, nodeId: number) => Promise<void>
  fetchQuestions: (roadmapId: number, nodeId: number, quizId: number) => Promise<void>
  syncQuiz: (roadmapId: number, nodeId: number, quiz: QuizSyncRequest) => Promise<boolean>
  syncQuestions: (
    roadmapId: number,
    nodeId: number,
    quizId: number,
    questions: QuestionsSyncRequest,
  ) => Promise<boolean>

  startQuiz: () => void
  selectAnswer: (questionId: number, optionId: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitQuiz: (roadmapId: number, nodeId: number, quizId: number) => Promise<boolean>
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quiz: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeRemaining: null,
  isLoading: false,
  error: null,
  quizResult: null,

  fetchQuiz: async (roadmapId, nodeId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await quizApi.getQuiz(roadmapId, nodeId)

      if (error) {
        set({ error, isLoading: false })
        return
      }

      set({ quiz: data, isLoading: false })

      if (data && data.id) {
        await get().fetchQuestions(roadmapId, nodeId, data.id)
      }
    } catch (error) {
      console.error("Fetch quiz error:", error)
      set({ error: "Failed to fetch quiz", isLoading: false })
    }
  },

  fetchQuestions: async (roadmapId, nodeId, quizId) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await quizApi.getQuestions(roadmapId, nodeId, quizId)

      if (error || !data) {
        set({ error, isLoading: false })
        return
      }

      set({ questions: data, isLoading: false })
    } catch (error) {
      console.error("Fetch questions error:", error)
      set({ error: "Failed to fetch questions", isLoading: false })
    }
  },

  syncQuiz: async (roadmapId, nodeId, quiz) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await quizApi.syncQuiz(roadmapId, nodeId, quiz)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      set({ quiz: data, isLoading: false })

      toast({
        title: "Success",
        description: "Quiz updated successfully",
      })

      return true
    } catch (error) {
      console.error("Sync quiz error:", error)
      set({ error: "Failed to update quiz", isLoading: false })
      return false
    }
  },

  syncQuestions: async (roadmapId, nodeId, quizId, questions) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await quizApi.syncQuestions(roadmapId, nodeId, quizId, questions)

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      set({ questions: data, isLoading: false })

      toast({
        title: "Success",
        description: "Quiz questions updated successfully",
      })

      return true
    } catch (error) {
      console.error("Sync questions error:", error)
      set({ error: "Failed to update questions", isLoading: false })
      return false
    }
  },

  startQuiz: () => {
    const quiz = get().quiz
    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: quiz?.time_limit ? quiz.time_limit * 60 : null,
      quizResult: null,
    })
  },

  selectAnswer: (questionId, optionId) => {
    const selectedAnswers = { ...get().selectedAnswers }
    selectedAnswers[questionId] = optionId
    set({ selectedAnswers })
  },

  nextQuestion: () => {
    const currentIndex = get().currentQuestionIndex
    const questions = get().questions

    if (currentIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentIndex + 1 })
    }
  },

  previousQuestion: () => {
    const currentIndex = get().currentQuestionIndex

    if (currentIndex > 0) {
      set({ currentQuestionIndex: currentIndex - 1 })
    }
  },

  submitQuiz: async (roadmapId, nodeId, quizId) => {
    try {
      set({ isLoading: true, error: null })

      const selectedAnswers = get().selectedAnswers
      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        question_id: Number.parseInt(questionId),
        option_id: optionId,
      }))

      const { data, error } = await quizApi.submitQuiz(roadmapId, nodeId, quizId, { answers })

      if (error || !data) {
        set({ error, isLoading: false })
        return false
      }

      set({ quizResult: data, isLoading: false })

      toast({
        title: data.passed ? "Congratulations!" : "Quiz Result",
        description: data.message,
        variant: data.passed ? "default" : "destructive",
      })

      return true
    } catch (error) {
      console.error("Submit quiz error:", error)
      set({ error: "Failed to submit quiz", isLoading: false })
      return false
    }
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: null,
      quizResult: null,
    })
  },
}))
