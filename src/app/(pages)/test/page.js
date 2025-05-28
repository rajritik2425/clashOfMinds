"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import Modal from "../../components/ui/modal"
import { Clock, Trophy, XCircle, BarChart3 } from "lucide-react"
import Link from "next/link"

const testData = {
    duration: 10 * 60,
    questions: [
        { id: "q1", question: "Which of the following is a JavaScript framework?", options: ["Django", "Laravel", "React", "Flask"], answer: "React" },
        { id: "q2", question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
        { id: "q3", question: "Which language is used for styling web pages?", options: ["HTML", "JQuery", "CSS", "XML"], answer: "CSS" },
        { id: "q4", question: "Which is not a programming language?", options: ["Python", "HTML", "Java", "C++"], answer: "HTML" },
        { id: "q5", question: "Which company developed React?", options: ["Google", "Facebook", "Microsoft", "Apple"], answer: "Facebook" },
        { id: "q6", question: "What is 2 + 2?", options: ["3", "4", "5", "22"], answer: "4" },
    ],
}

export default function TestPage() {
    const [timeLeft, setTimeLeft] = useState(testData.duration)
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const [passed, setPassed] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleSelect = (questionId, selectedOption) => {
        setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }))
    }

    const handleSubmit = () => {
        const correctAnswers = {
            q1: "React", q2: "Paris", q3: "CSS", q4: "HTML", q5: "Facebook", q6: "4"
        }

        let tempScore = 0
        testData.questions.forEach((question) => {
            if (answers[question.id] === correctAnswers[question.id]) {
                tempScore++
            }
        })

        const calculatedPercentage = Math.round((tempScore / testData.questions.length) * 100)
        const hasPassed = calculatedPercentage >= 75

        setScore(tempScore)
        setPercentage(calculatedPercentage)
        setPassed(hasPassed)
        setShowModal(true)

        localStorage.setItem("analysisData", JSON.stringify({
            questions: testData.questions,
            answers,
            correctAnswers,
            score: tempScore,
            percentage: calculatedPercentage,
            passed: hasPassed,
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-6 py-8 font-mono">
            <div className="flex justify-end mb-6">
                <div className="bg-black border-2 border-yellow-400 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                    <Clock className="text-yellow-300 w-5 h-5 animate-pulse" />
                    <span className="text-yellow-300 text-sm">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="space-y-6">
                {testData?.questions?.map((question, index) => (
                    <Card key={question.id} className="bg-[#212121] border-2 border-purple-600 shadow-lg hover:shadow-purple-500/40 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-300 tracking-wide">
                                🎮 Q{index + 1}: {question.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {question.options.map((option, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            id={`${question.id}-${i}`}
                                            name={question.id}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={() => handleSelect(question.id, option)}
                                            className="accent-purple-500 w-4 h-4"
                                        />
                                        <Label htmlFor={`${question.id}-${i}`} className="text-cyan-200 hover:text-yellow-300 cursor-pointer">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center pt-8">
                <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 border border-pink-300 shadow-xl shadow-pink-500/20 text-white font-bold py-3 px-8 rounded-xl tracking-widest transition-all duration-300"
                >
                    🧠 Submit & Conquer
                </Button>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center bg-[#111] p-6 rounded-xl border-4 border-yellow-500">
                    <div className="flex justify-center mb-4">
                        {passed ? (
                            <Trophy className="text-yellow-400 w-16 h-16 animate-bounce" />
                        ) : (
                            <XCircle className="text-red-500 w-16 h-16 animate-pulse" />
                        )}
                    </div>
                    <h2 className={`text-3xl mb-4 ${passed ? "text-green-400" : "text-red-400"}`}>
                        {passed ? "🏆 Victory Unlocked!" : "💥 Mission Failed!"}
                    </h2>
                    <p className="text-white text-lg mb-6">
                        Score: <span className="text-yellow-400 font-bold">{percentage}%</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/test/analysis">
                            <Button className="bg-purple-700 hover:bg-purple-800 border border-purple-300">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                See Analysis
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button onClick={() => router.push("/")} className="bg-cyan-700 hover:bg-cyan-800 border border-cyan-300">
                                🔙 Back to Base
                            </Button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
