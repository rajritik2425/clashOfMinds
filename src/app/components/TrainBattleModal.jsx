"use client"
import { useState } from "react"
import Modal from "./ui/modal"
import { Button } from "./ui/button"
import Image from "next/image"
import clsx from "clsx"

const difficulties = [
  { level: "Easy", image: "/images/easy.webp", points: -5 },
  { level: "Medium", image: "/images/medium.webp", points: -10 },
  { level: "Hard", image: "/images/hard.webp", points: -20 },
]

const sampleQuestion = {
    question: "A particle is moving in a straight line with a constant acceleration. If it starts from rest and covers a distance of 100 m in 5 seconds, what is its acceleration?",
    options: ["4 m/s²", "5 m/s²", "6 m/s²", "8 m/s²"],
    correct: "8 m/s²",
    hint: "Use the equation: s = ut + (1/2)at². Initial velocity u = 0.",
  }
  

export default function TrainBattleModal({ showModal, setShowModal }) {
  const [difficulty, setDifficulty] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const isCorrect = selectedOption === sampleQuestion.correct

  const handleClose = () => {
    setShowModal(false)
    setDifficulty(null)
    setSelectedOption(null)
    setSubmitted(false)
    setShowHint(false)
  }

  const handleSubmit = () => {
    if (selectedOption) setSubmitted(true)
  }

  return (
    <Modal isOpen={showModal} onClose={handleClose}>
      <div className="bg-[#1a1529] border border-yellow-500 p-6 rounded-lg shadow-2xl text-white font-[Orbitron] w-[90vw] max-w-2xl">

        {!difficulty && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">🎯 Choose Your Training Difficulty</h2>
            <div className="flex justify-around gap-4">
              {difficulties.map((d) => (
                <div
                  key={d.level}
                  onClick={() => setDifficulty(d)}
                  className="cursor-pointer p-3 border border-yellow-400 rounded-lg bg-slate-800 hover:bg-yellow-900/20 text-center w-full"
                >
                  <Image src={d.image} alt={d.level} width={80} height={80} className="mx-auto mb-2" />
                  <p className="font-bold">{d.level}</p>
                  <p className="text-yellow-400 text-sm">Points: {d.points}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {difficulty && !submitted && (
          <>
            <div className="mb-3 text-yellow-300 text-sm">⚔️ Mode: {difficulty.level}</div>
            <h3 className="text-lg font-bold mb-4">{sampleQuestion.question}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {sampleQuestion.options.map((opt, idx) => (
                <Button
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  className={clsx(
                    "py-2 px-3 rounded-md border font-semibold",
                    selectedOption === opt
                      ? "bg-yellow-400 text-black border-yellow-300"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                  )}
                >
                  {opt}
                </Button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={() => setShowHint((s) => !s)}
                className="text-blue-400 underline text-sm"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                onClick={handleSubmit}
                disabled={!selectedOption}
              >
                Submit
              </Button>
            </div>

            {showHint && <p className="mt-3 text-yellow-200 text-sm">{sampleQuestion.hint}</p>}
          </>
        )}

        {difficulty && submitted && (
          <div className="text-center space-y-4 mt-4">
            <Image
              src={difficulty.image}
              alt={difficulty.level}
              width={80}
              height={80}
              className="mx-auto"
            />
            <h2 className={`text-3xl font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
              {isCorrect ? "✅ Correct! +1" : "❌ Incorrect!"}
            </h2>
            <p className="text-yellow-300 font-semibold">Difficulty: {difficulty.level}</p>

            <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
