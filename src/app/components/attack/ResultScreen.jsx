import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Home, Search, Trophy, X } from "lucide-react";

export default function ResultScreen({
  destructionPercentage,
  opponent,
  playerGold,
  playerTrophies,
  nextOpponent,
}) {
  const isVictory = destructionPercentage >= 50;
  const goldReward = isVictory ? Math.floor(opponent.gold * 0.1) : 0;
  const trophyChange = isVictory ? 30 : -15;

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
            }`}>
            {isVictory ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <X className="w-10 h-10 text-white" />
            )}
          </div>

          <h2
            className={`text-3xl font-bold mb-4 ${
              isVictory ? "text-green-400" : "text-red-400"
            }`}>
            {isVictory ? "Victory!" : "Defeat!"}
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Destruction:</span>
              <span className="text-white font-bold">
                {destructionPercentage}%
              </span>
            </div>

            {isVictory && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Gold Earned:</span>
                  <span className="text-yellow-400 font-bold">
                    +{playerGold}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Elixir Earned:</span>
                  <span className="text-purple-400 font-bold">
                    +{playerTrophies}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Trophies:</span>
              <span
                className={`font-bold ${
                  trophyChange > 0 ? "text-green-400" : "text-red-400"
                }`}>
                {trophyChange > 0 ? "+" : ""}
                {trophyChange}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 font-bold py-3">
              <Home className="w-5 h-5 mr-2" />
              Return to Base
            </Button>

            <Button
              onClick={nextOpponent}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl">
              <Search className="w-5 h-5 mr-2" />
              Next Opponent
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
