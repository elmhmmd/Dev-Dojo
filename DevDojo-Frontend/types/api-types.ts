
export interface User {
  id: number
  username: string
  email: string
  role_id: 1 | 2
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role_id: number
}

export interface LoginRequest {
  email: string
  password: string
}


export interface Roadmap {
  id: number
  title: string
  published: boolean
  nodes?: Node[]
}

export interface RoadmapCreateRequest {
  title: string
}

export interface RoadmapUpdateRequest {
  title: string
  published: boolean
}

export interface RoadmapProgress {
  roadmap_id: number
  roadmap_title: string
  total_nodes: number
  completed_nodes: number
  progress_percentage: number
}


export interface Node {
  id: number
  roadmap_id: number
  title: string
  short_description: string | null
  long_description: string | null
  completion: boolean
}

export interface NodeCreateRequest {
  title: string
  short_description?: string
  long_description?: string
}

export interface NodeUpdateRequest {
  title: string
  short_description?: string
  long_description?: string
}


export interface Project {
  id: number
  node_id: number
  title: string
  description: string | null
}

export interface ProjectSyncRequest {
  id?: number
  title: string
  description?: string
}

export interface ProjectSubmission {
  id: number
  student_id: number
  project_id: number
  link: string
  score: number
}

export interface ProjectSubmitRequest {
  link: string
}


export interface Quiz {
  id: number
  node_id: number
  time_limit: number | null
}

export interface QuizSyncRequest {
  id?: number
  time_limit?: number
}

export interface Question {
  id: number
  quiz_id: number
  body: string
}

export interface Option {
  id: number
  question_id: number
  body: string
  is_correct: boolean
}

export interface QuestionsSyncRequest {
  questions: {
    id?: number
    body: string
  }[]
}

export interface OptionsSyncRequest {
  options: {
    id?: number
    body: string
    is_correct: boolean
  }[]
}

export interface QuizSubmitRequest {
  answers: {
    question_id: number
    option_id: number
  }[]
}

export interface QuizSubmitResponse {
  message: string
  score: number
  passed: boolean
}


export interface KeyLearningObjective {
  id: number
  node_id: number
  body: string
}

export interface KeyLearningObjectiveCreateRequest {
  body: string
}

export interface KeyLearningObjectiveUpdateRequest {
  body: string
}

export interface Resource {
  id: number
  node_id: number
  link: string
}

export interface ResourceCreateRequest {
  link: string
}

export interface ResourceUpdateRequest {
  link: string
}


export interface AdminStatistics {
  total_students: number
  total_roadmaps: number
  published_roadmaps: number
  unpublished_roadmaps: number
  most_popular_roadmap?: {
    id: number
    title: string
  }
}

export interface StudentStatistics {
  joined_roadmaps: number
  total_nodes_completed: number
  total_roadmaps_completed: number
  quizzes_passed: number
  projects_completed: number
  total_upvotes_gained: number
}
