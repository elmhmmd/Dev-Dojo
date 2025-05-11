"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quiz-store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { quizApi } from "@/lib/api"

export default function QuizPage() {
  const { id, nodeId, quizId } = useParams()
  const roadmapId = Number.parseInt(id as string)
  const nodeIdNum = Number.parseInt(nodeId as string)
  const quizIdNum = Number.parseInt(quizId as string)
  const router = useRouter()

  const {
    quiz,
    questions,
    currentQuestionIndex,
    selectedAnswers,
    quizResult,
    isLoading,
    fetchQuiz,
    fetchQuestions,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
  } = useQuizStore()

  const [options, setOptions] = useState<Option[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    if (roadmapId && nodeIdNum && quizIdNum) {
      fetchQuiz(roadmapId, nodeIdNum)
    }
  }, [roadmapId, nodeIdNum, quizIdNum, fetchQuiz])

  useEffect(() => {
    resetQuiz()
  }, [resetQuiz])

  useEffect(() => {
    const fetchOptions = async () => {
      if (questions.length > 0 && currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex]

        try {
          const { data, error } = await quizApi.getOptions(roadmapId, nodeIdNum, quizIdNum, currentQuestion.id)

          if (error || !data) {
            console.error("Failed to fetch options:", error)
            return
          }

          setOptions(data)
        } catch (error) {
          console.error("Error fetching options:", error)
        }
      }
    }

    fetchOptions()
  }, [questions, currentQuestionIndex, roadmapId, nodeIdNum, quizIdNum])

  useEffect(() => {
    if (!quizStarted || timeLeft === null) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          toast({
            title: "Time's up!",
            description: "Your quiz time has expired.",
            variant: "destructive",
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeLeft])

  const handleStartQuiz = () => {
    startQuiz()
    setQuizStarted(true)
    setTimeLeft(quiz?.time_limit ? quiz.time_limit * 60 : 600)
  }

  const handleSelectAnswer = (optionId: number) => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      selectAnswer(questions[currentQuestionIndex].id, optionId)
    }
  }

  const handleSubmitQuiz = async () => {
    if (roadmapId && nodeIdNum && quizIdNum) {
      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        question_id: Number.parseInt(questionId),
        option_id: optionId,
      }))

      if (answers.length === 0) {
        toast({
          title: "Warning",
          description: "Please answer at least one question before submitting.",
          variant: "destructive",
        })
        return
      }

      await submitQuiz(roadmapId, nodeIdNum, quizIdNum)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg mt-4" />
            <Skeleton className="h-64 w-full rounded-lg mt-8" />
            <Skeleton className="h-12 w-48 rounded-lg mt-8 ml-auto" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (quizResult) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className={`${quizResult.passed ? "bg-green-600" : "bg-red-600"} text-white px-6 py-4`}>
                <h1 className="text-xl font-bold">Quiz Results</h1>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  {quizResult.passed ? (
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  )}

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {quizResult.passed ? "Congratulations!" : "Quiz Failed"}
                  </h2>

                  <p className="text-gray-600 mb-6">{quizResult.message}</p>

                  <div className="text-center mb-8">
                    <p className="text-lg font-medium">Your Score</p>
                    <p className="text-3xl font-bold">
                      {quizResult.score} / {questions.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {quizResult.passed ? "You have passed this quiz!" : "You need 7 or more correct answers to pass."}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => resetQuiz()}>Try Again</Button>
                    <Link href={`/roadmaps/${roadmapId}/nodes/${nodeIdNum}`}>
                      <Button variant="outline">Back to Node</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h2>
              <p className="text-gray-600 mb-6">This quiz is not available or doesn't exist.</p>
              <Link href={`/roadmaps/${roadmapId}/nodes/${nodeIdNum}`}>
                <Button>Back to Node</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-purple-600 text-white px-6 py-4">
                <h1 className="text-xl font-bold">Quiz Instructions</h1>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Before You Begin</h2>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>This quiz contains {questions.length} questions.</li>
                    <li>You have {quiz.time_limit || 10} minutes to complete the quiz.</li>
                    <li>You need to answer at least 7 questions correctly to pass.</li>
                    <li>You can navigate between questions using the Next and Previous buttons.</li>
                    <li>Your answers are saved as you progress through the quiz.</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleStartQuiz} size="lg">
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Quiz Header */}
            <div className="bg-purple-600 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Quiz</h1>
                <Button variant="ghost" className="text-white hover:text-purple-200" onClick={nextQuestion}>
                  Skip Question
                </Button>
              </div>
            </div>

            {/* Quiz Progress */}
            <div className="bg-gray-100 px-6 py-3 flex justify-between items-center border-b border-gray-200">
              <div className="text-sm text-gray-600">
                Question <span className="font-medium">{currentQuestionIndex + 1}</span> of{" "}
                <span className="font-medium">{questions.length}</span>
              </div>
              {timeLeft !== null && (
                <div className="text-sm text-gray-600">
                  <Clock className="inline-block mr-1 h-4 w-4" /> {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {/* Question */}
            {questions.length > 0 && currentQuestionIndex < questions.length ? (
              <div className="px-6 py-8">
                <h2 className="text-xl font-medium text-gray-900 mb-6">{questions[currentQuestionIndex].body}</h2>

                {/* Answer Options */}
                <RadioGroup
                  value={selectedAnswers[questions[currentQuestionIndex].id]?.toString() || ""}
                  onValueChange={(value) => handleSelectAnswer(Number.parseInt(value))}
                  className="space-y-4"
                >
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <RadioGroupItem
                        value={option.id.toString()}
                        id={`option-${option.id}`}
                        className="h-4 w-4 text-purple-600"
                      />
                      <Label htmlFor={`option-${option.id}`} className="ml-3 font-medium text-gray-700 cursor-pointer">
                        {option.body}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-600">No questions available for this quiz.</p>
              </div>
            )}

            {/* Quiz Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={nextQuestion}>Next Question</Button>
              ) : (
                <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
