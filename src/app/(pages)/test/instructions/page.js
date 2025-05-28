"use client"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { GamepadIcon, BookOpen, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../utils/AuthContext"

export default function TestInstructionsPage() {
  const router = useRouter();
  const {isAuthenticated} = useAuth();
  if(!isAuthenticated){
    router.push('/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a001f] via-[#1c0049] to-[#0a001f] flex items-center justify-center p-6 font-[Orbitron] relative overflow-hidden">
      
      {/* Glowing animated background lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-indigo-900/60 to-black"></div>
      <div className="fixed inset-0 opacity-40 animate-pulse-slow">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/30 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg text-white space-y-8">
        <Card className="bg-[#0f0c29]/90 border border-purple-700 backdrop-blur-md shadow-2xl shadow-purple-700/50 rounded-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-5 w-20 h-20 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_0_20px_#8a2be2]">
              <BookOpen className="w-10 h-10 text-white drop-shadow-[0_0_10px_cyan]" />
            </div>
            <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wide ">
              Test Instructions
            </CardTitle>
            <p className="text-slate-400 mt-1 text-lg italic drop-shadow-[0_0_3px_indigo]">
              Read carefully before starting
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-slate-300 text-base leading-relaxed tracking-wide">
            <ul className="list-disc list-inside space-y-3">
              <li>The test consists of <span className="text-cyan-400 font-bold">20 questions</span>.</li>
              <li>You will have <span className="text-purple-400 font-bold">30 minutes</span> to complete the test.</li>
              <li>There is <span className="text-green-400 font-bold">no negative marking</span>.</li>
              <li>Each question carries <span className="text-yellow-400 font-bold">equal marks</span>.</li>
              <li>Make sure your internet connection is <span className="text-red-400 font-bold">stable</span>.</li>
              <li>Do not <span className="underline decoration-red-500">refresh or close</span> the browser window during the test.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6">
          <Link href="/test">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-purple-700 text-black font-extrabold py-4 px-10 rounded-2xl shadow-[0_0_20px_#6ee7b7] hover:shadow-[0_0_30px_#6ee7b7] transition-shadow duration-300 flex items-center gap-3 tracking-wider text-lg"
            >
              <GamepadIcon className="w-6 h-6 drop-shadow-[0_0_8px_cyan]" />
              Start Test
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="h-12 px-8 border-purple-600 text-purple-400 hover:bg-purple-900 hover:text-white font-semibold tracking-wide transition-colors duration-300 flex items-center gap-2 text-lg"
            >
              <Home className="w-6 h-6" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
