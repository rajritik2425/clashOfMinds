import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Shield, X, Skull } from "lucide-react";

export default function BattleScreen({
  battleBase,
  selectedTroop,
  deployedTroops,
  destructionPercentage,
  battleTime,
  attackingCell,
  attackType,
  damageNumbers,
  destructionEffects,
  endBattle,
  deployTroop,
  setSelectedTroop,
  formatTime,
  isStructureAccessible,
}) {
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
                        ) : structure.imageURL ? (
                          <img
                            src={structure.imageURL}
                            alt={structure.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
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
                console.log(troop),
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
                      className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${troop.color} flex items-center justify-center shadow-lg overflow-hidden`}
                    >
                      
                        <img
                          src={troop.imageUrl}
                          alt={troop.name}
                          className="w-full h-full object-cover rounded-lg"
                        />

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
