'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function ClanView() {
    const [showWarLog, setShowWarLog] = useState(false);

    const clan = {
        name: "The Order",
        motto: "Wisdom Through War",
        description:
            "Welcome to The Order – the first clan ever created! Read the rules before donating. Everyone is welcome as we represent a global community. Let the battles begin!",
        league: "Unranked",
        totalPoints: 29092,
        highestTrophies: 4472,
        warStats: {
            won: 5,
            lost: 2,
            draw: 1,
        },
    };

    const members = [
        { name: "fatouan", designation: "Elder", donated: 770, received: 1971, trophies: 4472, level: 185 },
        { name: "VENDETTA", designation: "Elder", donated: 714, received: 1004, trophies: 4064, level: 170 },
        { name: "RAGNAR", designation: "Co-Leader", donated: 850, received: 1200, trophies: 4200, level: 178 },
        { name: "shadowX", designation: "Member", donated: 500, received: 1300, trophies: 3900, level: 160 },
        { name: "blaze", designation: "Leader", donated: 1000, received: 1400, trophies: 4600, level: 190 },
    ];

    const warLog = [
        { enemy: "Dark Knights", result: "Win", pointsChange: "+300", league: "Gold II" },
        { enemy: "Firestorm", result: "Loss", pointsChange: "-150", league: "Gold II" },
        { enemy: "Ice Titans", result: "Win", pointsChange: "+250", league: "Gold II" },
    ];

    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen p-6 font-mono text-sm pixelated">
            <style>{`
                .pixelated { image-rendering: pixelated; }
                .retro-text { text-shadow: 2px 2px #FF00FF, -2px -2px #00FFFF; }
            `}</style>

            <div className="text-center text-4xl font-extrabold mb-2 retro-text tracking-wide animate-pulse uppercase">{clan.name}</div>
            <div className="text-center text-lg mb-6 italic text-gray-300">{clan.motto}</div>

            <div className="bg-gray-800/80 p-5 rounded-2xl mb-6 shadow-lg border border-gray-700">
                <p className="mb-3 text-gray-300 leading-relaxed">{clan.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>🏆 <span className="text-yellow-400">League:</span> {clan.league}</p>
                    <p>⭐ <span className="text-yellow-300">Total Points:</span> {clan.totalPoints}</p>
                    <p>🥇 <span className="text-green-400">Highest Trophies:</span> {clan.highestTrophies}</p>
                    <p>⚔️ <span className="text-red-400">War Stats:</span> Wins: {clan.warStats.won}, Losses: {clan.warStats.lost}, Draws: {clan.warStats.draw}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                <Link href='/clan/war'>
                    <Button className="bg-purple-700 hover:bg-purple-800 transition-all shadow-md">Clan War</Button>
                </Link>
                <Link href='/clan/join'>
                    <Button className="bg-red-700 hover:bg-red-800 transition-all shadow-md">Leave</Button>
                </Link>
                <Button className="bg-yellow-700 hover:bg-yellow-800 transition-all shadow-md" onClick={() => setShowWarLog(true)}>War Log</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {members.map((m, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-900/80 p-4 rounded-xl shadow-md border border-gray-700 transition-transform duration-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="font-bold text-white text-lg tracking-wide uppercase">{m.name}</div>
                                <div className="text-gray-400 text-xs">{m.designation}</div>
                            </div>
                            <div className="text-right text-xs">
                                <div className="text-green-400">🏆 {m.trophies}</div>
                                <div className="text-yellow-400">🔰 Lvl {m.level}</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-300">
                            <p>📤 Donated: {m.donated}</p>
                            <p>📥 Received: {m.received}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {showWarLog && (
                <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-2xl border border-gray-700">
                        <h2 className="text-2xl retro-text mb-4 text-center">📜 War Log</h2>
                        {warLog.map((log, idx) => (
                            <div key={idx} className="mb-3 border-b border-gray-600 pb-3">
                                <p className="font-semibold text-white">🏹 Opponent: {log.enemy}</p>
                                <p>Result: <span className={log.result === 'Win' ? 'text-green-400' : 'text-red-400'}>{log.result}</span></p>
                                <p>🎯 Points: {log.pointsChange}</p>
                                <p>🏆 League: {log.league}</p>
                            </div>
                        ))}
                        <div className="text-center mt-4">
                            <Button className="bg-red-600 hover:bg-red-700 transition-all" onClick={() => setShowWarLog(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}