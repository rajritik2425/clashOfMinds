"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { User, Trophy, Sword, Coins, Zap, HelpCircle, ShoppingCart, Settings, Shield, Play } from "lucide-react"
import Link from "next/link"
import BattleLogsModal from './BattleLogsModal'


const buildingTypes = [
  {
    name: "Town Hall",
    image: "https://cdn.pixabay.com/photo/2021/04/18/12/09/building-6187584_1280.png",
  },
  {
    name: "Barracks",
    image: "https://cdn-icons-png.flaticon.com/512/1183/1183621.png",
  },
  {
    name: "Gold Mine",
    image: "https://cdn-icons-png.flaticon.com/512/2753/2753924.png",
  },
  {
    name: "Elixir Collector",
    image: "https://cdn-icons-png.flaticon.com/512/1486/1486486.png",
  },
]

export default function HomeGameInterface() {
  const [selectedCell, setSelectedCell] = useState(null)
  const [hoveredCell, setHoveredCell] = useState(null)
  const [trophies, setTrophies] = useState(0)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const gridSize = 10
  const totalCells = gridSize * gridSize

  const [buildingsData, setBuildingsData] = useState([])
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const tempGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null))

    // Generate 10 unique random positions
    const positions = new Set()
    while (positions.size < 10) {
      const row = Math.floor(Math.random() * gridSize)
      const col = Math.floor(Math.random() * gridSize)
      positions.add(`${row},${col}`)
    }

    // Place buildings at those positions
    positions.forEach((pos) => {
      const [row, col] = pos.split(",").map(Number)
      const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]
      tempGrid[row][col] = {
        ...type,
        level: Math.floor(Math.random() * 5) + 1,
      }
    })

    setBuildingsData(tempGrid)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  if (buildingsData.length === 0) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30"
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-amber-500/30 font-bold"
                >
                  <div className="flex gap-2 items-center">
                    <Trophy className="w-4 h-4" />
                    <span>Trophies</span>
                    <span className="text-amber-400 font-bold">{trophies}</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-red-500/30 font-bold"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Attack
                </Button>
              </CardContent>
            </Card>

            {/* Battle Stats */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Battle Stats</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Wins</span>
                    <span className="text-green-400 font-bold">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Losses</span>
                    <span className="text-red-400 font-bold">23</span>
                  </div>
                  <span onClick={() => { setShowModal(true) }} className="text-sm cursor-pointer underline text-blue-200">📜 View Battle Logs</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <BattleLogsModal showModal={showModal} setShowModal={setShowModal} />



          {/* Main Game Area */}
          <div className="lg:col-span-8">
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                    BASE STRUCTURE
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-10 gap-1 max-w-2xl mx-auto p-4 bg-slate-900/50 rounded-2xl border border-slate-600/30">
                  {Array.from({ length: totalCells }, (_, i) => {
                    const row = Math.floor(i / gridSize)
                    const col = i % gridSize
                    const building = buildingsData[row][col]

                    return (
                      <div
                        key={i}
                        className={`
                          aspect-square border border-slate-600/50 rounded-lg cursor-pointer transition-all duration-200 relative
                          ${selectedCell === i
                            ? "bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-cyan-400 shadow-lg shadow-cyan-500/25"
                            : hoveredCell === i
                              ? "bg-slate-700/50 border-slate-500"
                              : "bg-slate-800/30 hover:bg-slate-700/50"
                          }
                        `}
                        // onClick={() => setSelectedCell(selectedCell === i ? null : i)}
                        onMouseEnter={() => {
                          if (hoverTimeout) {
                            clearTimeout(hoverTimeout)
                            setHoverTimeout(null)
                          }
                          setHoveredCell(i)
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setHoveredCell(null)
                          }, 300) // 300ms delay
                          setHoverTimeout(timeout)
                        }}
                      >
                        {building && (
                          <img
                            src={building.image || "/placeholder.svg"}
                            alt={building.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}

                        {hoveredCell === i && building && (
                          <div
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 w-48"
                            onMouseEnter={() => {
                              if (hoverTimeout) {
                                clearTimeout(hoverTimeout)
                                setHoverTimeout(null)
                              }
                            }}
                            onMouseLeave={() => {
                              const timeout = setTimeout(() => {
                                setHoveredCell(null)
                              }, 100) // Shorter delay when leaving popup
                              setHoverTimeout(timeout)
                            }}
                          >
                            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-xl shadow-black/50">
                              {/* Building Image */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 p-1">
                                  <img
                                    src={building.image || "/placeholder.svg"}
                                    alt={building.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">{building.name}</div>
                                  <div className="text-xs text-slate-300">Level {building.level}</div>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Health</span>
                                  <span className="text-green-400 font-medium">100%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Production</span>
                                  <span className="text-yellow-400 font-medium">+50/hr</span>
                                </div>
                              </div>

                              {/* Accept Challenge Button */}
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg shadow-orange-500/25 border border-orange-400/30"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Handle challenge acceptance logic here
                                  console.log(`Challenge accepted for ${building.name} at level ${building.level}`)
                                }}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                Accept Challenge
                              </Button>

                              {/* Arrow pointing down */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/95"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* <div className="text-center mt-4 text-sm text-slate-400">Click on grid cells to place structures</div> */}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Resource Details */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Resources</div>

                <div className="space-y-4">
                  {/* Gold */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-300">Gold</span>
                      </div>
                      <span className="text-yellow-400 font-bold">100 / 1000</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>

                  {/* Elixir */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Elixir</span>
                      </div>
                      <span className="text-purple-400 font-bold">100 / 1000</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>

                  {/* Hints */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">Hints</span>
                      </div>
                      <span className="text-blue-400 font-bold">10 / 50</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/25 border border-green-400/30"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Build
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Upgrade
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Move
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}