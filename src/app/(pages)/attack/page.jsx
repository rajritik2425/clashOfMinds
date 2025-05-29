"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import {
  Castle,
  Shield,
  Zap,
  Coins,
  Sword,
  Home,
  Trophy,
  Users,
  Search,
  X,
  RotateCcw,
  Target,
  Skull,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../utils/AuthContext"
import Loading from "../../components/ui/loading"

const API_BASE_URL = "https://clash-of-minds.onrender.com/api"

export default function AttackPage() {
  const TROOPS = [
    {
      id: "barbarian", 
      name: "Barbarian",
      icon: Sword,
      damage: 25,
      health: 100,
      count: 10,
      cost: 5,
      color: "from-red-600 to-red-800",
    },
    {
      id: "archer",
      name: "Archer",
      icon: Target,
      damage: 15,
      health: 60,
      count: 15,
      cost: 3,
      color: "from-green-600 to-green-800",
    },
    {
      id: "wizard",
      name: "Wizard",
      icon: Zap,
      damage: 40,
      health: 80,
      count: 5,
      cost: 10,
      color: "from-purple-600 to-purple-800",
    },
    {
      id: "giant",
      name: "Giant",
      icon: Shield,
      damage: 50,
      health: 300,
      count: 3,
      cost: 25,
      color: "from-blue-600 to-blue-800",
    },
  ]

  const createRandomBase = () => {
    const base = Array(80).fill(null)

    // Place main castle at center (4 grids)
    const centerPositions = [34, 35, 44, 45]
    centerPositions.forEach((pos) => {
      base[pos] = {
        id: `castle-${pos}`,
        name: "Main Castle",
        icon: Castle,
        color: "from-purple-600 to-purple-800",
        health: 500,
        maxHealth: 500,
        isDestroyed: false,
        isMainCastle: true,
      }
    })

    // Add random structures
    const structures = [
      { name: "Guard Tower", icon: Shield, color: "from-blue-600 to-blue-800", health: 200 },
      { name: "Cannon", icon: Zap, color: "from-yellow-600 to-orange-600", health: 150 },
      { name: "Gold Mine", icon: Coins, color: "from-yellow-500 to-yellow-700", health: 100 },
      { name: "Barracks", icon: Sword, color: "from-red-600 to-red-800", health: 180 },
      { name: "House", icon: Home, color: "from-green-600 to-green-800", health: 120 },
    ]

    // Place 15-20 random structures
    const numStructures = Math.floor(Math.random() * 6) + 15
    for (let i = 0; i < numStructures; i++) {
      let pos
      do {
        pos = Math.floor(Math.random() * 80)
      } while (base[pos] !== null)

      const structure = structures[Math.floor(Math.random() * structures.length)]
      base[pos] = {
        id: `structure-${pos}`,
        name: structure.name,
        icon: structure.icon,
        color: structure.color,
        health: structure.health,
        maxHealth: structure.health,
        isDestroyed: false,
      }
    }

    return base
  }

  const DUMMY_OPPONENTS = [
    { id: "1", name: "DragonSlayer", level: 12, trophies: 1250, gold: 50000, elixir: 25000, base: createRandomBase() },
    { id: "2", name: "WarChief", level: 15, trophies: 1800, gold: 75000, elixir: 40000, base: createRandomBase() },
    { id: "3", name: "StormKing", level: 10, trophies: 980, gold: 35000, elixir: 18000, base: createRandomBase() },
    { id: "4", name: "IronFist", level: 18, trophies: 2200, gold: 120000, elixir: 60000, base: createRandomBase() },
    { id: "5", name: "ShadowBlade", level: 8, trophies: 750, gold: 25000, elixir: 12000, base: createRandomBase() },
  ]

  const [gameState, setGameState] = useState("searching")
  const [currentOpponent, setCurrentOpponent] = useState(null)
  const [battleBase, setBattleBase] = useState([])
  const [selectedTroop, setSelectedTroop] = useState(null)
  const [deployedTroops, setDeployedTroops] = useState(TROOPS.map((t) => ({ ...t })))
  const [destructionPercentage, setDestructionPercentage] = useState(0)
  const [battleTime, setBattleTime] = useState(120) // 3 minutes
  const [isAttacking, setIsAttacking] = useState(false)
  const [playerGold, setPlayerGold] = useState(100000)
  const [playerTrophies, setPlayerTrophies] = useState(0)
  const battleInterval = useRef()

  const [attackingCell, setAttackingCell] = useState(null)
  const [attackType, setAttackType] = useState(null)
  const [damageNumbers, setDamageNumbers] = useState([])
  const [destructionEffects, setDestructionEffects] = useState([])
  const router = useRouter();
  const {isAuthenticated, token} = useAuth();
  

  // Helper function to check if a structure is accessible (not surrounded)
  const isStructureAccessible = (cellIndex, base) => {
    const gridWidth = 10
    const gridHeight = 8
    const row = Math.floor(cellIndex / gridWidth)
    const col = cellIndex % gridWidth

    // Check all 4 directions (up, down, left, right)
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ]

    let accessibleSides = 0

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      // Check if the new position is within bounds
      if (newRow >= 0 && newRow < gridHeight && newCol >= 0 && newCol < gridWidth) {
        const adjacentIndex = newRow * gridWidth + newCol
        const adjacentStructure = base[adjacentIndex]

        // If adjacent cell is empty or destroyed, structure is accessible from this side
        if (!adjacentStructure || adjacentStructure.isDestroyed) {
          accessibleSides++
        }
      }
      // If adjacent to grid edge, it's NOT counted as accessible (as per your requirement)
    }

    // Structure is accessible if it has at least 2 accessible sides
    return accessibleSides >= 2
  }

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        window.location.href = "/login"
        return null
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return null
        }
        throw new Error("Failed to fetch user data")
      }
      
      const userData = await response.json()
      setPlayerTrophies(userData.trophies || 0)
      setPlayerGold(userData.gold || 100000)
      return userData._id
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  // Fetch opponent base
  const fetchOpponentBase = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to fetch opponent base")
      
      const baseData = await response.json()
      return baseData.base || []
    } catch (error) {
      console.error("Error fetching opponent base:", error)
      return []
    }
  }

  // Fetch opponent troops
  const fetchOpponentTroops = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/troops/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to fetch opponent troops")
      
      return await response.json()
    } catch (error) {
      console.error("Error fetching opponent troops:", error)
      return []
    }
  }

  // Search for opponent
  const searchOpponent = async () => {
    setGameState("searching")
    setDeployedTroops(TROOPS.map((t) => ({ ...t })))
    setSelectedTroop(null)
    setDestructionPercentage(0)
    setBattleTime(120)

    try {
      if (!token) {
        window.location.href = "/login"
        return
      }

      const response = await fetch(`${API_BASE_URL}/battles/find-opponent`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error("Failed to find opponent")
      }
      
      const opponentData = await response.json()
      
      // Format opponent data
      const opponent = {
        id: opponentData.userId,
        name: opponentData.username,
        level: opponentData.level || 1,
        trophies: opponentData.trophies || 0,
        gold: opponentData.resources?.gold || 50000,
        elixir: opponentData.resources?.elixir || 25000,
      }

      // Convert base layout to grid format
      const baseGrid = Array(80).fill(null)
      opponentData.base.forEach(structure => {
        const position = structure.position
        if (position >= 0 && position < 80) {
          baseGrid[position] = {
            id: structure.id,
            name: structure.type,
            icon: getStructureIcon(structure.type),
            color: getStructureColor(structure.type),
            health: structure.health,
            maxHealth: structure.maxHealth || structure.health,
            isDestroyed: false,
            isMainCastle: structure.type === "Study Hall"
          }
        }
      })
      
      setCurrentOpponent(opponent)
      setBattleBase(baseGrid)
      setGameState("preview")
    } catch (error) {
      console.error("Error finding opponent:", error)
      // Fallback to dummy opponent for development
      if (process.env.NODE_ENV === "development") {
        const dummyOpponent = {
          id: "dummy-1",
          name: "Test Opponent",
          level: 10,
          trophies: 1000,
          gold: 50000,
          elixir: 25000,
        }
        setCurrentOpponent(dummyOpponent)
        setBattleBase(createRandomBase())
        setGameState("preview")
      } else {
        // In production, show error and return to home
        alert("Failed to find an opponent. Please try again later.")
        window.location.href = "/"
      }
    }
  }

  // Helper to get structure icon
  const getStructureIcon = (name) => {
    if (name.includes("Study Hall")) return Castle
    if (name.includes("Mine")) return Coins
    if (name.includes("Tower")) return Shield
    if (name.includes("Arena")) return Trophy
    return Home
  }

  // Helper to get structure color
  const getStructureColor = (name) => {
    if (name.includes("Study Hall")) return "from-purple-600 to-purple-800"
    if (name.includes("Mine")) return "from-yellow-500 to-yellow-700"
    if (name.includes("Tower")) return "from-blue-600 to-blue-800"
    if (name.includes("Arena")) return "from-green-600 to-green-800"
    return "from-gray-600 to-gray-800"
  }

  const skipOpponent = () => {
    const skipCost = 1000
    if (playerGold >= skipCost) {
      setPlayerGold((prev) => prev - skipCost)
      searchOpponent()
    }
  }

  const startBattle = () => {
    setGameState("battle")
    setBattleTime(120)
    setDestructionPercentage(0)
    setIsAttacking(false)

    battleInterval.current = setInterval(() => {
      setBattleTime((prev) => {
        if (prev <= 1) {
          endBattle()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endBattle = async () => {
    if (battleInterval.current) {
      clearInterval(battleInterval.current)
    }
    setGameState("result")
    setIsAttacking(false)

    try {
      if (!token) {
        window.location.href = "/login"
        return
      }

      const battleResult = {
        opponentId: currentOpponent.id,
        destructionPercentage,
        isVictory: destructionPercentage >= 50,
        destroyedStructures: battleBase
          .filter(structure => structure && structure.isDestroyed)
          .map(structure => structure.id)
      }

      const response = await fetch(`${API_BASE_URL}/battles/end`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(battleResult)
      })

      if (!response.ok) {
        throw new Error("Failed to submit battle results")
      }

      const result = await response.json()
      
      // Update player resources
      setPlayerGold(prev => prev + (result.rewards?.gold || 0))
      setPlayerTrophies(prev => prev + (result.rewards?.trophies || 0))
    } catch (error) {
      console.error("Error submitting battle results:", error)
      // Continue showing results even if submission fails
    }
  }

  const deployTroop = (cellIndex) => {
    // Check if we have a selected troop and it has count > 0
    if (!selectedTroop || selectedTroop.count <= 0) return

    const targetStructure = battleBase[cellIndex]

    // Check if there's a structure to attack and it's not destroyed
    if (!targetStructure || targetStructure.isDestroyed) return

    // Check if the structure is accessible (not completely surrounded)
    if (!isStructureAccessible(cellIndex, battleBase)) {
      return
    }

    // Start attacking animation with troop-specific effects
    setIsAttacking(true)
    setAttackingCell(cellIndex)
    setAttackType(selectedTroop.id)

    // Create damage number animation
    const damage = selectedTroop.damage
    setDamageNumbers((prev) => [
      ...prev,
      {
        id: Date.now(),
        damage,
        cellIndex,
        timestamp: Date.now(),
      },
    ])

    // Simulate troop attack with enhanced timing
    setTimeout(() => {
      const newBase = [...battleBase]
      const target = newBase[cellIndex]

      if (target && !target.isDestroyed) {
        const newHealth = Math.max(0, target.health - selectedTroop.damage)
        target.health = newHealth

        if (newHealth === 0) {
          target.isDestroyed = true
          // Add destruction effect
          setDestructionEffects((prev) => [
            ...prev,
            {
              id: Date.now(),
              cellIndex,
              timestamp: Date.now(),
            },
          ])
        }

        setBattleBase(newBase)

        // Calculate destruction percentage
        const totalStructures = newBase.filter((s) => s !== null).length
        const destroyedStructures = newBase.filter((s) => s !== null && s.isDestroyed).length
        const newPercentage = Math.floor((destroyedStructures / totalStructures) * 100)
        setDestructionPercentage(newPercentage)

        // Check for victory conditions
        if (newPercentage >= 100) {
          setTimeout(endBattle, 1000)
        }
      }

      // Decrease troop count
      setDeployedTroops((prev) =>
        prev.map((t) => (t.id === selectedTroop.id && t.count > 0 ? { ...t, count: t.count - 1 } : t)),
      )

      // Auto-deselect troop if count reaches 0
      const updatedTroop = deployedTroops.find((t) => t.id === selectedTroop.id)
      if (updatedTroop && updatedTroop.count <= 1) {
        setSelectedTroop(null)
      }

      setIsAttacking(false)
      setAttackingCell(null)
      setAttackType(null)
    }, 1200) // Longer animation duration
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    // Fetch current user on component mount
    const fetchData = async () => {
      const userId = await fetchCurrentUser()
      if (userId) {
        searchOpponent()
      }
    }
    
    fetchData()

    const interval = setInterval(() => {
      const now = Date.now()
      setDamageNumbers((prev) => prev.filter((effect) => now - effect.timestamp < 2000))
      setDestructionEffects((prev) => prev.filter((effect) => now - effect.timestamp < 3000))
    }, 100)

    return () => {
      if (battleInterval.current) {
        clearInterval(battleInterval.current)
      }
      clearInterval(interval)
    }
  }, [])

  if(!isAuthenticated){
    return <Loading/>
  }

  if (gameState === "searching") {
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

  if (gameState === "preview") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Opponent Info */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{currentOpponent?.name}</CardTitle>
                    <p className="text-slate-400">Level {currentOpponent?.level}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1">
                    <Trophy className="w-4 h-4 mr-1" />
                    {currentOpponent?.trophies}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-3 py-1">
                    <Coins className="w-4 h-4 mr-1" />
                    {currentOpponent?.gold?.toLocaleString()}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                    <Zap className="w-4 h-4 mr-1" />
                    {currentOpponent?.elixir?.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Base Preview */}
          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-10 gap-1 max-w-4xl mx-auto mb-6">
                {battleBase.map((structure, index) => (
                  <div
                    key={index}
                    className="aspect-square border border-slate-600/50 rounded-lg bg-slate-900/30 relative"
                  >
                    {structure && (
                      <div
                        className={`w-full h-full rounded-lg bg-gradient-to-br ${structure.color} flex items-center justify-center shadow-lg`}
                      >
                        <structure.icon className="w-4 h-4 text-white" />
                        {structure.isMainCastle && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Castle className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={skipOpponent}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Skip (-1,000 Gold)
            </Button>

            <Button
              onClick={startBattle}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-red-500/25"
            >
              <Sword className="w-5 h-5 mr-2" />
              Attack!
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "battle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900/50 to-slate-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Battle HUD */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 text-lg font-bold">
                {formatTime(battleTime)}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-lg font-bold">
                {destructionPercentage}% Destroyed
              </Badge>
            </div>

            <Button
              onClick={endBattle}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-6 py-3 rounded-xl"
            >
              <X className="w-5 h-5 mr-2" />
              End Battle
            </Button>
          </div>

          {/* Battle Grid */}
          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm mb-4 relative overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-10 gap-1 max-w-4xl mx-auto relative">
                {battleBase.map((structure, index) => {
                  const isAccessible =
                    structure && !structure.isDestroyed ? isStructureAccessible(index, battleBase) : true
                  const canAttack =
                    selectedTroop && selectedTroop.count > 0 && structure && !structure.isDestroyed && isAccessible
                  const isBeingAttacked = attackingCell === index

                  return (
                    <div
                      key={index}
                      className={`aspect-square border border-slate-600/50 rounded-lg bg-slate-900/30 relative transition-all duration-200 ${
                        canAttack
                          ? "cursor-crosshair hover:border-red-500 hover:shadow-lg hover:shadow-red-500/25"
                          : structure && !structure.isDestroyed && !isAccessible
                            ? "cursor-not-allowed border-gray-500"
                            : "cursor-default"
                      } ${isBeingAttacked ? "animate-pulse" : ""}`}
                      onClick={() => canAttack && deployTroop(index)}
                    >
                      {structure && (
                        <div
                          className={`w-full h-full rounded-lg bg-gradient-to-br ${
                            structure.isDestroyed
                              ? "from-gray-600 to-gray-800 opacity-50"
                              : !isAccessible
                                ? `${structure.color} opacity-60`
                                : structure.color
                          } flex flex-col items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 ${
                            isBeingAttacked ? "scale-110" : ""
                          }`}
                        >
                          {structure.isDestroyed ? (
                            <Skull className="w-4 h-4 text-red-400" />
                          ) : (
                            <structure.icon className="w-4 h-4 text-white" />
                          )}

                          {/* Health bar */}
                          {!structure.isDestroyed && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-b-lg transition-all duration-500"
                                style={{ width: `${(structure.health / structure.maxHealth) * 100}%` }}
                              />
                            </div>
                          )}

                          {/* Inaccessible indicator */}
                          {!structure.isDestroyed && !isAccessible && (
                            <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                              <Shield className="w-3 h-3 text-gray-400" />
                            </div>
                          )}

                          {/* Enhanced Attack Animations */}
                          {isBeingAttacked && attackType && (
                            <>
                              {/* Barbarian - Sword Slash */}
                              {attackType === "barbarian" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-8 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-ping transform rotate-45"></div>
                                  <div className="absolute w-6 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-ping transform -rotate-45 animation-delay-200"></div>
                                  {/* Slash particles */}
                                  <div className="absolute w-1 h-1 bg-red-400 rounded-full animate-bounce top-1 left-1"></div>
                                  <div className="absolute w-1 h-1 bg-orange-400 rounded-full animate-bounce top-2 right-1 animation-delay-100"></div>
                                  <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-bounce bottom-1 left-2 animation-delay-300"></div>
                                </div>
                              )}

                              {/* Archer - Arrow */}
                              {attackType === "archer" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-0.5 bg-gradient-to-r from-brown-600 to-brown-400 animate-ping transform rotate-45"></div>
                                  <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                  {/* Arrow trail */}
                                  <div className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent to-green-400 animate-pulse transform rotate-45"></div>
                                </div>
                              )}

                              {/* Wizard - Magic Spell */}
                              {attackType === "wizard" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                                  <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping animation-delay-200"></div>
                                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                                  {/* Magic particles */}
                                  <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-bounce top-0 left-1 animation-delay-100"></div>
                                  <div className="absolute w-1 h-1 bg-pink-400 rounded-full animate-bounce top-1 right-0 animation-delay-200"></div>
                                  <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce bottom-0 left-0 animation-delay-300"></div>
                                  <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-bounce bottom-1 right-1 animation-delay-400"></div>
                                </div>
                              )}

                              {/* Giant - Ground Pound */}
                              {attackType === "giant" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-8 h-8 border-2 border-blue-400 rounded-full animate-ping"></div>
                                  <div className="absolute w-6 h-6 border-2 border-cyan-400 rounded-full animate-ping animation-delay-200"></div>
                                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                                  {/* Shockwave effect */}
                                  <div className="absolute w-10 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-ping"></div>
                                  <div className="absolute w-1 h-10 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-ping"></div>
                                </div>
                              )}

                              {/* Screen shake effect */}
                              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg"></div>
                            </>
                          )}

                          {/* Destruction Effect */}
                          {destructionEffects.some((effect) => effect.cellIndex === index) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-ping"></div>
                              <div className="absolute w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping animation-delay-100"></div>
                              <div className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-ping animation-delay-200"></div>
                              {/* Explosion particles */}
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 bg-orange-400 rounded-full animate-bounce"
                                  style={{
                                    top: `${20 + Math.sin((i * 45 * Math.PI) / 180) * 15}px`,
                                    left: `${20 + Math.cos((i * 45 * Math.PI) / 180) * 15}px`,
                                    animationDelay: `${i * 50}ms`,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Floating Damage Numbers */}
                      {damageNumbers
                        .filter((dmg) => dmg.cellIndex === index)
                        .map((dmg) => (
                          <div
                            key={dmg.id}
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-10"
                            style={{
                              animation: "floatUp 2s ease-out forwards",
                            }}
                          >
                            <div className="text-red-400 font-bold text-lg drop-shadow-lg">-{dmg.damage}</div>
                          </div>
                        ))}
                    </div>
                  )
                })}
              </div>

              {/* Add custom CSS for animations */}
              <style jsx>{`
                @keyframes floatUp {
                  0% {
                    transform: translateX(-50%) translateY(0px);
                    opacity: 1;
                    scale: 1;
                  }
                  50% {
                    transform: translateX(-50%) translateY(-20px);
                    opacity: 1;
                    scale: 1.2;
                  }
                  100% {
                    transform: translateX(-50%) translateY(-40px);
                    opacity: 0;
                    scale: 0.8;
                  }
                }
                
                .animation-delay-100 {
                  animation-delay: 100ms;
                }
                .animation-delay-200 {
                  animation-delay: 200ms;
                }
                .animation-delay-300 {
                  animation-delay: 300ms;
                }
                .animation-delay-400 {
                  animation-delay: 400ms;
                }
              `}</style>
            </CardContent>
          </Card>

          {/* Troops Panel */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Deploy Troops
                </h3>
                <p className="text-slate-400 text-sm">
                  Click on a troop, then click on accessible structures to attack
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {deployedTroops.map((troop) => (
                  <div
                    key={troop.id}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTroop?.id === troop.id
                        ? "border-cyan-500 bg-cyan-500/20"
                        : troop.count > 0
                          ? "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                          : "border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => troop.count > 0 && setSelectedTroop(troop)}
                  >
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${troop.color} flex items-center justify-center shadow-lg`}
                      >
                        <troop.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-1">{troop.name}</h4>
                      <Badge
                        variant="outline"
                        className={`${troop.count > 0 ? "border-cyan-500 text-cyan-400" : "border-slate-600 text-slate-500"}`}
                      >
                        {troop.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "result") {
    const isVictory = destructionPercentage >= 50
    const goldReward = isVictory ? Math.floor(currentOpponent.gold * 0.1) : 0
    const elixirReward = isVictory ? Math.floor(currentOpponent.elixir * 0.1) : 0
    const trophyChange = isVictory ? 30 : -15

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isVictory
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-gradient-to-br from-red-500 to-red-700"
              }`}
            >
              {isVictory ? <Trophy className="w-10 h-10 text-white" /> : <X className="w-10 h-10 text-white" />}
            </div>

            <h2 className={`text-3xl font-bold mb-4 ${isVictory ? "text-green-400" : "text-red-400"}`}>
              {isVictory ? "Victory!" : "Defeat!"}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Destruction:</span>
                <span className="text-white font-bold">{destructionPercentage}%</span>
              </div>

              {isVictory && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Gold Earned:</span>
                    <span className="text-yellow-400 font-bold">+{goldReward.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Elixir Earned:</span>
                    <span className="text-purple-400 font-bold">+{elixirReward.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-300">Trophies:</span>
                <span className={`font-bold ${trophyChange > 0 ? "text-green-400" : "text-red-400"}`}>
                  {trophyChange > 0 ? "+" : ""}
                  {trophyChange}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 font-bold py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Base
              </Button>

              <Button
                onClick={searchOpponent}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Next Opponent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}