"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import Link from "next/link"
import { useAuth } from "../../../utils/AuthContext"
import { useRouter } from "next/navigation"

export default function AnalysisPage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const [data, setData] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        const stored = localStorage.getItem("analysisData")
        if (stored) {
            setData(JSON.parse(stored))
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) router.push('/login')
    if (!data) return <div className="text-white p-6 font-[Orbitron]">Loading...</div>

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white font-[Orbitron]">
            <h2 className="text-4xl font-extrabold text-center mb-8 text-cyan-400 tracking-widest">Mission Debrief</h2>

            <div className="text-center mb-10 space-y-2">
                <p className="text-xl text-slate-300 font-medium">
                    Score: <span className="text-white font-bold">{data.score}</span> / {data.questions.length}
                </p>
                <p className={`text-3xl font-bold ${data.passed ? "text-green-400" : "text-red-400"}`}>
                    {data.passed ? "Victory Achieved!" : "Mission Failed"} ({data.percentage}%)
                </p>
            </div>

            {data.questions.map((q, index) => {
                const userAnswer = data.answers[q.id]
                const correctAnswer = data.correctAnswers[q.id]

                return (
                    <Card
                        key={q.id}
                        className="bg-[#1e1e2f] border border-purple-700 shadow-lg shadow-purple-900/30 mb-6 backdrop-blur-md"
                    >
                        <CardHeader>
                            <CardTitle className="text-lg text-cyan-300 font-semibold">
                                Q{index + 1}. {q.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {q.options.map((opt, i) => {
                                let bg = "bg-slate-800"
                                let border = ""
                                let label = ""

                                if (opt === userAnswer) {
                                    if (opt === correctAnswer) {
                                        bg = "bg-green-700"
                                        border = "border-2 border-green-400"
                                        label = "✅ Your Correct Answer"
                                    } else {
                                        bg = "bg-red-700"
                                        border = "border-2 border-red-400"
                                        label = "❌ Your Wrong Answer"
                                    }
                                } else if (opt === correctAnswer) {
                                    bg = "bg-green-500"
                                    border = "border border-green-400"
                                    label = "✔ Correct Answer"
                                }

                                return (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-md ${bg} ${border} text-white transition-all duration-150 flex justify-between items-center`}
                                    >
                                        <span>{opt}</span>
                                        <span className="text-sm text-gray-300 italic">{label}</span>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                )
            })}

            <div className="text-center mt-10">
                <Link href="/">
                    <Button className="bg-gradient-to-r from-[#00c9ff] to-[#92fe9d] text-black font-bold px-8 py-3 rounded-xl shadow-lg border border-cyan-200 hover:scale-105 transition-all duration-200">
                        🔙 Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
