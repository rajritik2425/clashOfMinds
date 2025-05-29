import React from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Castle, Users, Trophy, Coins, Zap, RotateCcw, Sword } from "lucide-react"

export default function PreviewScreen({ opponent, battleBase, skipOpponent, startBattle }) {
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
                  <CardTitle className="text-2xl text-white">{opponent?.name}</CardTitle>
                  <p className="text-slate-400">Level {opponent?.level}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  {opponent?.trophies}
                </Badge>
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-3 py-1">
                  <Coins className="w-4 h-4 mr-1" />
                  {opponent?.gold?.toLocaleString()}
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                  <Zap className="w-4 h-4 mr-1" />
                  {opponent?.elixir?.toLocaleString()}
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
                      className={`p-1 w-full h-full rounded-lg bg-gradient-to-br ${structure.color} flex items-center justify-center shadow-lg overflow-hidden`}
                    >
                      {structure.imageURL ? (
                        <img
                          src={structure.imageURL}
                          alt={structure.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <structure.icon className="w-4 h-4 text-white" />
                      )}
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
