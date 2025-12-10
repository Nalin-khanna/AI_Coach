import { BookOpen } from "lucide-react";
function Header () {
    return (
        <div>
        <header className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-blue-600 rounded-full shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Instructional Coach</h1>
          <p className="text-slate-500">Upload a classroom recording to get pedagogical feedback.</p>
        </header>
        </div>
    )
}

export default Header
