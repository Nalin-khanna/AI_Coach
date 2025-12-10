import { BookOpen } from "lucide-react";
function Header () {
    return (
        <div>
        <header className="flex flex-col items-center gap-3 mb-12 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            AI Instructional Coach
          </h1>
          <p className="text-slate-300 text-center max-w-md text-sm sm:text-base px-4">
            Upload a voice recording to receive AI-powered pedagogical insights and actionable feedback.
          </p>
        </header>
        </div>
    )
}

export default Header
