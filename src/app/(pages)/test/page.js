"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import Modal from "../../components/ui/modal"
import { Clock, Trophy, XCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../utils/AuthContext"
import Loading from "../../components/ui/loading";

const testData = {
    duration: 10 * 60,
    questions: [
        {
          id: "q1",
          question: "If the roots of the equation x² - 5x + k = 0 are real and equal, then the value of k is:",
          options: ["25", "5", "6.25", "None of these"],
          answer: "6.25"
        },
        {
          id: "q2",
          question: "Which of the following compounds exhibits resonance?",
          options: ["C₂H₆", "CH₄", "CH₃COOH", "C₂H₅OH"],
          answer: "CH₃COOH"
        },
        {
          id: "q3",
          question: "A particle moves with uniform acceleration. Its velocity after 5 seconds is 20 m/s and after 10 seconds is 40 m/s. What is the acceleration?",
          options: ["2 m/s²", "4 m/s²", "3 m/s²", "5 m/s²"],
          answer: "4 m/s²"
        },
        {
          id: "q4",
          question: "Which of the following has the highest bond enthalpy?",
          options: ["O₂", "N₂", "F₂", "Cl₂"],
          answer: "N₂"
        },
        {
          id: "q5",
          question: "The area enclosed between the curve y = x² and the line y = 4 is:",
          options: ["8/3", "16/3", "32/3", "None of these"],
          answer: "32/3"
        },
        {
          id: "q6",
          question: "Which among the following elements has the smallest atomic radius?",
          options: ["Na", "Mg", "Al", "Si"],
          answer: "Si"
        },
        {
          id: "q7",
          question: "The dimensional formula for Planck’s constant is:",
          options: ["ML²T⁻¹", "ML²T⁻²", "MLT⁻²", "ML²T⁻³"],
          answer: "ML²T⁻¹"
        },
        {
          id: "q8",
          question: "If sinθ + cosθ = √2, then the value of tanθ is:",
          options: ["1", "2", "√2", "0"],
          answer: "1"
        }
      ],      
}

export default function TestPage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const [timeLeft, setTimeLeft] = useState(testData.duration)
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const [passed, setPassed] = useState(false)
    const [showModal, setShowModal] = useState(false)

    

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

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [isAuthenticated, router])

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
