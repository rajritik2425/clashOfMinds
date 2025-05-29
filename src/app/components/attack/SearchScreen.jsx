import React from "react"
import { Card, CardContent } from "../ui/card"
import { Progress } from "../ui/progress"
import { Search } from "lucide-react"

export default function SearchScreen({ battleTime }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Searching for Opponent
          </h2>
          <p className="text-slate-400">Finding a worthy adversary...</p>
          <div className="mt-6">
            <Progress value={66} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
