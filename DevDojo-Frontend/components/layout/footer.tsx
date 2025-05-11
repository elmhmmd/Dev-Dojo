import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">DevDojo</h2>
            <p className="text-gray-300 mt-2">Master programming, one step at a time.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="https://github.com" className="text-gray-300 hover:text-white">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="https://twitter.com" className="text-gray-300 hover:text-white">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="https://linkedin.com" className="text-gray-300 hover:text-white">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-gray-300 text-center">© {new Date().getFullYear()} DevDojo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
