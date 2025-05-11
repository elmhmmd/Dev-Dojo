"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quiz-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { quizApi } from "@/lib/api"

interface QuestionWithOptions {
  id?: number
  body: string
  options: {
    id?: number
    body: string
    is_correct: boolean
  }[]
}

export default function QuizEditorPage() {
  const { id, nodeId } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const nodeIdNum = Number.parseInt(nodeId as string)
  const router = useRouter()

  const { quiz, isLoading: isQuizLoading, fetchQuiz } = useQuizStore()

  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true)
      try {
        await fetchQuiz(roadmapId, nodeIdNum)
      } finally {
        setIsLoading(false)
      }
    }

    if (roadmapId && nodeIdNum) {
      loadQuiz()
    }
  }, [roadmapId, nodeIdNum, fetchQuiz])

  useEffect(() => {
    const loadQuestions = async () => {
      if (!quiz) return

      setIsLoading(true)
      try {
        const { data, error } = await quizApi.getQuestions(roadmapId, nodeIdNum, quiz.id)

        if (error || !data) {
          toast({
            title: "Error",
            description: error || "Failed to load questions",
            variant: "destructive",
          })
          return
        }

        const questionsWithOptions: QuestionWithOptions[] = []

        for (const question of data) {
          const { data: optionsData, error: optionsError } = await quizApi.getOptions(
            roadmapId,
            nodeIdNum,
            quiz.id,
            question.id,
          )

          if (optionsError) {
            toast({
              title: "Error",
              description: `Failed to load options for question ${question.id}`,
              variant: "destructive",
            })
            continue
          }

          questionsWithOptions.push({
            id: question.id,
            body: question.body,
            options: optionsData || [],
          })
        }

        setQuestions(questionsWithOptions)
      } finally {
        setIsLoading(false)
      }
    }

    if (quiz) {
      loadQuestions()
    }
  }, [quiz, roadmapId, nodeIdNum])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        body: "",
        options: [
          { body: "", is_correct: true },
          { body: "", is_correct: false },
          { body: "", is_correct: false },
          { body: "", is_correct: false },
        ],
      },
    ])
    setCurrentQuestionIndex(questions.length)
  }

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].body = value
    setQuestions(updatedQuestions)
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex].body = value
    setQuestions(updatedQuestions)
  }

  const handleCorrectOptionChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]

    updatedQuestions[questionIndex].options.forEach((option, idx) => {
      option.is_correct = idx === optionIndex
    })

    setQuestions(updatedQuestions)
  }

  const handleSaveQuiz = async () => {
    if (!quiz) return

    for (const [index, question] of questions.entries()) {
      if (!question.body.trim()) {
        toast({
          title: "Validation Error",
          description: `Question ${index + 1} cannot be empty`,
          variant: "destructive",
        })
        return
      }

      const hasCorrectOption = question.options.some((option) => option.is_correct)
      if (!hasCorrectOption) {
        toast({
          title: "Validation Error",
          description: `Question ${index + 1} must have at least one correct option`,
          variant: "destructive",
        })
        return
      }

      for (const [optIndex, option] of question.options.entries()) {
        if (!option.body.trim()) {
          toast({
            title: "Validation Error",
            description: `Option ${optIndex + 1} for Question ${index + 1} cannot be empty`,
            variant: "destructive",
          })
          return
        }
      }
    }

    setIsSaving(true)
    try {
      const { data: questionsData, error: questionsError } = await quizApi.syncQuestions(
        roadmapId,
        nodeIdNum,
        quiz.id,
        { questions: questions.map((q) => ({ id: q.id, body: q.body })) },
      )

      if (questionsError || !questionsData) {
        toast({
          title: "Error",
          description: questionsError || "Failed to save questions",
          variant: "destructive",
        })
        return
      }

      for (let i = 0; i < questionsData.length; i++) {
        const questionId = questionsData[i].id
        const options = questions[i]?.options || []

        const { error: optionsError } = await quizApi.syncOptions(roadmapId, nodeIdNum, quiz.id, questionId, {
          options: options.map((o) => ({ id: o.id, body: o.body, is_correct: o.is_correct })),
        })

        if (optionsError) {
          toast({
            title: "Error",
            description: `Failed to save options for question ${i + 1}`,
            variant: "destructive",
          })
          return
        }
      }

      toast({
        title: "Success",
        description: "Quiz saved successfully",
      })

      const { data: updatedQuestions, error: loadError } = await quizApi.getQuestions(roadmapId, nodeIdNum, quiz.id)

      if (!loadError && updatedQuestions) {
        const questionsWithOptions: QuestionWithOptions[] = []

        for (const question of updatedQuestions) {
          const { data: optionsData } = await quizApi.getOptions(roadmapId, nodeIdNum, quiz.id, question.id)

          questionsWithOptions.push({
            id: question.id,
            body: question.body,
            options: optionsData || [],
          })
        }

        setQuestions(questionsWithOptions)
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || isQuizLoading) {
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

  if (!quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
            <p className="text-gray-600 mb-6">You need to create a quiz for this node first.</p>
            <Button asChild>
              <Link href={`/admin/roadmaps/${roadmapId}/nodes/${nodeIdNum}`}>Back to Node</Link>
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
              href={`/admin/roadmaps/${roadmapId}/nodes/${nodeIdNum}`}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Node
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Editor</CardTitle>
              <CardDescription>Create and edit quiz questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">
                    {questions.length > 0
                      ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                      : "No questions yet"}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0 || questions.length === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1 || questions.length === 0}
                  >
                    Next
                  </Button>
                  <Button onClick={handleAddQuestion} disabled={questions.length >= 10}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
              </div>

              {questions.length >= 10 && (
                <div className="mt-2 text-sm text-amber-600">Maximum of 10 questions reached.</div>
              )}

              {questions.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="question-text">Question</Label>
                    <Textarea
                      id="question-text"
                      value={questions[currentQuestionIndex].body}
                      onChange={(e) => handleQuestionChange(currentQuestionIndex, e.target.value)}
                      placeholder="Enter your question here"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Options (select the correct answer)</Label>
                    {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Input
                            value={option.body}
                            onChange={(e) => handleOptionChange(currentQuestionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={option.is_correct}
                            onCheckedChange={() => handleCorrectOptionChange(currentQuestionIndex, optionIndex)}
                          />
                          <Label className="text-sm">Correct</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No questions added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Question" to create your first question</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveQuiz} disabled={isSaving || questions.length === 0}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Quiz"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
