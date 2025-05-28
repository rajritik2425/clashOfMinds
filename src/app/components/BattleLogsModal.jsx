"use client"
import { useState } from "react"
import  Modal  from "./ui/modal" // adjust path if your modal is elsewhere
import { Button } from "./ui/button"
import clsx from "clsx"

export default function BattleLogsModal({ showModal, setShowModal }) {
  const [activeTab, setActiveTab] = useState("attack")

  const attackLogs = [
    { name: "Ritik", stars: 3, trophies: -10, loot: { gold: -100, elixir: -200 } },
    { name: "Arjun", stars: 2, trophies: +15, loot: { gold: 300, elixir: 150 } },
  ]

  const defenseLogs = [
    { name: "Yash", stars: 1, trophies: -5, loot: { gold: -50, elixir: -100 } },
    { name: "Ritik", stars: 4, trophies: -10, loot: { gold: -100, elixir: -200 } },
  ]

  const renderStars = (count) => "⭐️".repeat(count)

  const renderLogs = (logs) => (
    <table className="w-full text-md text-yellow-100 font-[Orbitron] mt-4">
      <thead className="text-xs uppercase text-yellow-300 border-b border-yellow-600">
        <tr>
          <th className="py-2 px-3 text-left">Name</th>
          <th className="py-2 px-3 text-left">Stars</th>
          <th className="py-2 px-3 text-left">Trophies</th>
          <th className="py-2 px-3 text-left">Loot</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i} className="border-b border-yellow-700/30">
            <td className="py-2 px-3">{log.name}</td>
            <td className="py-2 px-3">{renderStars(log.stars)}</td>
            <td className={`py-2 px-3 font-bold ${log.trophies < 0 ? "text-red-400" : "text-green-400"}`}>
              {log.trophies > 0 ? "+" : ""}{log.trophies}
            </td>
            <td className="py-2 px-3">
              <span className={log.loot.gold < 0 ? "text-red-400" : "text-yellow-400"}>
                💰 {log.loot.gold}
              </span>{" "}
              /{" "}
              <span className={log.loot.elixir < 0 ? "text-red-400" : "text-purple-400"}>
                💎 {log.loot.elixir}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="bg-[#1a1529] p-6 rounded-lg shadow-2xl border border-purple-700 text-white font-[Orbitron] w-[90vw] max-w-2xl">
        <div className="flex justify-center mb-6 gap-4">
          <Button
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-200",
              activeTab === "attack"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg"
                : "bg-slate-800 border border-yellow-500 hover:bg-yellow-700/20"
            )}
            onClick={() => setActiveTab("attack")}
          >
            ⚔️ Attack Logs
          </Button>

          <Button
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-200",
              activeTab === "defense"
                ? "bg-gradient-to-r from-blue-400 to-purple-500 text-black shadow-lg"
                : "bg-slate-800 border border-blue-500 hover:bg-blue-700/20"
            )}
            onClick={() => setActiveTab("defense")}
          >
            🛡️ Defense Logs
          </Button>
        </div>

        {activeTab === "attack" ? renderLogs(attackLogs) : renderLogs(defenseLogs)}
      </div>
    </Modal>
  )
}
