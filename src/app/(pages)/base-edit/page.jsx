"use client"

import React, { useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  Castle,
  Shield,
  Zap,
  Coins,
  Sword,
  Home,
  Factory,
  TreePine,
  Mountain,
  Flame,
  RotateCcw,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Structure and GridCell definitions are implicit in JS

const STRUCTURES = [
  { id: "castle", name: "Castle", icon: Castle, color: "from-purple-600 to-purple-800", type: "defense" },
  { id: "tower", name: "Guard Tower", icon: Shield, color: "from-blue-600 to-blue-800", type: "defense" },
  { id: "cannon", name: "Cannon", icon: Zap, color: "from-yellow-600 to-orange-600", type: "offense" },
  { id: "mine", name: "Gold Mine", icon: Coins, color: "from-yellow-500 to-yellow-700", type: "resource" },
  { id: "barracks", name: "Barracks", icon: Sword, color: "from-red-600 to-red-800", type: "military" },
  { id: "house", name: "House", icon: Home, color: "from-green-600 to-green-800", type: "civilian" },
  { id: "factory", name: "Factory", icon: Factory, color: "from-gray-600 to-gray-800", type: "production" },
  { id: "forest", name: "Forest", icon: TreePine, color: "from-emerald-600 to-emerald-800", type: "resource" },
  { id: "mountain", name: "Mountain", icon: Mountain, color: "from-stone-600 to-stone-800", type: "terrain" },
  { id: "forge", name: "Forge", icon: Flame, color: "from-orange-600 to-red-600", type: "production" },
]

export default function BaseBuilder() {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({ id: i, structure: null })),
  )

  const [inventory, setInventory] = useState(() =>
    STRUCTURES.map((structure) => ({ structure, count: 5 })),
  )

  const [draggedStructure, setDraggedStructure] = useState(null)
  const [draggedFromGrid, setDraggedFromGrid] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const dragCounter = useRef(0)

  const structuresPerPage = 4
  const totalPages = Math.ceil(inventory.length / structuresPerPage)
  const currentStructures = inventory.slice(
    currentPage * structuresPerPage,
    (currentPage + 1) * structuresPerPage,
  )

  const handleDragStart = (structure, fromGrid) => {
    setDraggedStructure(structure)
    if (fromGrid !== undefined) {
      setDraggedFromGrid(fromGrid)
    }
  }

  const handleDragEnd = () => {
    setDraggedStructure(null)
    setDraggedFromGrid(null)
    dragCounter.current = 0
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDragLeave = () => {
    dragCounter.current--
  }

  const handleDropOnGrid = (cellId) => {
    if (!draggedStructure) return

    const newGrid = [...grid]
    const targetCell = newGrid[cellId]

    // Dropping from inventory
    if (draggedFromGrid === null) {
      const inventoryItem = inventory.find(
        (item) => item.structure.id === draggedStructure.id,
      )
      if (!inventoryItem || inventoryItem.count <= 0) return

      if (targetCell.structure) {
        setInventory((prev) =>
          prev.map((item) =>
            item.structure.id === targetCell.structure.id
              ? { ...item, count: item.count + 1 }
              : item,
          ),
        )
      }

      targetCell.structure = draggedStructure

      setInventory((prev) =>
        prev.map((item) =>
          item.structure.id === draggedStructure.id
            ? { ...item, count: item.count - 1 }
            : item,
        ),
      )
    } else {
      const sourceCell = newGrid[draggedFromGrid]

      if (targetCell.structure) {
        sourceCell.structure = targetCell.structure
      } else {
        sourceCell.structure = null
      }

      targetCell.structure = draggedStructure
    }

    setGrid(newGrid)
  }

  const handleDropOnInventory = () => {
    if (!draggedStructure || draggedFromGrid === null) return

    const newGrid = [...grid]
    newGrid[draggedFromGrid].structure = null
    setGrid(newGrid)

    setInventory((prev) =>
      prev.map((item) =>
        item.structure.id === draggedStructure.id
          ? { ...item, count: item.count + 1 }
          : item,
      ),
    )
  }

  const clearGrid = () => {
    const structureCounts = {}
    grid.forEach((cell) => {
      if (cell.structure) {
        structureCounts[cell.structure.id] =
          (structureCounts[cell.structure.id] || 0) + 1
      }
    })

    setInventory((prev) =>
      prev.map((item) => ({
        ...item,
        count: item.count + (structureCounts[item.structure.id] || 0),
      })),
    )

    setGrid(grid.map((cell) => ({ ...cell, structure: null })))
  }

  const removeFromGrid = (cellId) => {
    const cell = grid[cellId]
    if (!cell.structure) return

    setInventory((prev) =>
      prev.map((item) =>
        item.structure.id === cell.structure.id
          ? { ...item, count: item.count + 1 }
          : item,
      ),
    )

    setGrid(
      grid.map((c, i) =>
        i === cellId ? { ...c, structure: null } : c,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25">
            <X className="w-5 h-5 mr-2" /> Exit Edit Mode
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={clearGrid}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 font-bold px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Clear All
            </Button>

            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-500/25">
              <Save className="w-5 h-5 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-10 gap-1 max-w-4xl mx-auto">
              {grid.map((cell) => (
                <div
                  key={cell.id}
                  className="aspect-square border-2 border-slate-600/50 rounded-lg bg-slate-900/30 hover:bg-slate-800/50 transition-all duration-200 relative group cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleDropOnGrid(cell.id)
                  }}
                >
                  {cell.structure && (
                    <div
                      draggable
                      onDragStart={() => handleDragStart(cell.structure, cell.id)}
                      onDragEnd={handleDragEnd}
                      className={`w-full h-full rounded-lg bg-gradient-to-br ${cell.structure.color} flex items-center justify-center cursor-move shadow-lg`}
                    >
                      <cell.structure.icon className="w-6 h-6 text-white" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromGrid(cell.id)
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Structures Inventory */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Structures</h3>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="bg-slate-700/50 border-slate-600 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-slate-400 text-sm">
                  {currentPage + 1} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="bg-slate-700/50 border-slate-600 text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className="grid grid-cols-4 gap-4"
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault()
                handleDropOnInventory()
              }}
            >
              {currentStructures.map((item) => (
                <div
                  key={item.structure.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    item.count > 0
                      ? "border-slate-600 bg-slate-800/50 hover:border-slate-500 cursor-grab"
                      : "border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    draggable={item.count > 0}
                    onDragStart={() => item.count > 0 && handleDragStart(item.structure)}
                    onDragEnd={handleDragEnd}
                    className="text-center"
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-lg bg-gradient-to-br ${item.structure.color} flex items-center justify-center shadow-lg`}
                    >
                      <item.structure.icon className="w-8 h-8 text-white" />
                    </div>

                    <h4 className="text-sm font-semibold text-slate-300 mb-1">{item.structure.name}</h4>

                    <Badge
                      variant="outline"
                      className={`${
                        item.count > 0 ? "border-cyan-500 text-cyan-400" : "border-slate-600 text-slate-500"
                      }`}
                    >
                      {item.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-slate-400">
              Drag structures to the grid above to build your base
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
