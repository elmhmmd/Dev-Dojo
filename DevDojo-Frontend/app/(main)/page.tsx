import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { CheckCircle, LineChartIcon as ChartLine, MapPin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Master Programming
              </h1>
              <h2 className="mt-3 text-3xl font-bold text-purple-600 sm:text-4xl">Step by Step</h2>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Follow a structured learning path, validate your skills, and track your progress with DevDojo's
                interactive roadmap.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link href="/login">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Why Choose DevDojo?</h2>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white mx-auto">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="mt-5 text-center">
                      <h3 className="text-lg font-medium text-gray-900">Structured Learning Path</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Follow a clear roadmap designed to take you from beginner to professional developer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white mx-auto">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="mt-5 text-center">
                      <h3 className="text-lg font-medium text-gray-900">Skill Validation</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Validate your knowledge through quizzes and practical projects reviewed by peers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white mx-auto">
                      <ChartLine className="h-6 w-6" />
                    </div>
                    <div className="mt-5 text-center">
                      <h3 className="text-lg font-medium text-gray-900">Progress Tracking</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Monitor your learning journey with detailed progress tracking and analytics.
                      </p>
                    </div>
                  </div>
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
