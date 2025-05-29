'use client'
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";

export default function ClanWarPage() {
    const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60);
    const [attack1Used, setAttack1Used] = useState(false);
    const [attack2Used, setAttack2Used] = useState(false);
    const [showBaseList, setShowBaseList] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [taskProgress, setTaskProgress] = useState({ mocks: 40, videos: 250 });
    const enemyBases = [1, 2, 3, 4, 5];
    const enemyStars = [3, 2, 1, 0, 2];
    const memberContributions = [80, 60, 75, 55, 90];

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}d ${h}h ${m}m`;
    };

    const handleAttackClick = () => {
        setShowBaseList(true);
    };

    const handleBaseAttack = (baseId) => {
        if (!attack1Used) setAttack1Used(true);
        else if (!attack2Used) setAttack2Used(true);
        setShowBaseList(false);
    };

    const getPixelBase = (stars) => {
        const damageLevel = ['opacity-100', 'opacity-75', 'opacity-50', 'opacity-25'];
        return (
            <div className={`relative w-20 h-20 bg-cover border-2 border-yellow-400 ${damageLevel[3 - stars]} rounded-md shadow-md shadow-yellow-200`} style={{ backgroundImage: `url('/pixel-base.png')` }}>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-yellow-300 text-sm">
                    {'⭐'.repeat(stars) + '☆'.repeat(3 - stars)}
                </div>
            </div>
        );
    };
    

    return (
        <div className="bg-black text-white min-h-screen p-6 font-mono text-sm pixelated">
            <style>{`
                .pixelated { image-rendering: pixelated; }
                .retro-text { text-shadow: 2px 2px #FF00FF, -2px -2px #00FFFF; }
            `}</style>

            <div className="text-center text-3xl font-bold mb-8 retro-text animate-pulse">
                ⏳ Time Remaining: {formatTime(timeLeft)}
            </div>

            <div className="flex justify-between items-center mb-10 gap-6">
                <div className="flex-1 text-xl font-semibold text-center retro-text">🏰 Clan 1</div>
                <div className="flex-1">
                    <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }} animate={{ scaleX: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                    </div>
                </div>
                <div className="flex-1 text-xl font-semibold text-center retro-text">⚔️ Clan 2</div>
                <div className="flex-1">
                    <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-red-500 rounded-full" style={{ width: '40%' }} animate={{ scaleX: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <Button className="bg-blue-600 hover:bg-blue-800 transition-all shadow-md shadow-blue-400" onClick={() => setShowTasks(true)}>
                    📋 View Task List
                </Button>
            </div>

            <div className="flex gap-8">
                <div className="w-1/2 space-y-4">
                    {memberContributions.map((percent, i) => (
                        <motion.div key={i} className="bg-gray-800 rounded-lg p-4 shadow-inner hover:shadow-xl transition-all" whileHover={{ scale: 1.03 }}>
                            <div className="flex justify-between items-center">
                                <span className="text-lg">👤 Member {i + 1}</span>
                                <span className="text-green-400 font-semibold">{percent}%</span>
                            </div>
                        </motion.div>
                    ))}

                    <div className="flex justify-around pt-4">
                        <Button className={`text-white px-6 ${attack1Used ? 'bg-red-600' : 'bg-green-600'} shadow-lg`} onClick={handleAttackClick} disabled={attack1Used}>
                            ⚔️ Attack 1
                        </Button>
                        <Button className={`text-white px-6 ${attack2Used ? 'bg-red-600' : 'bg-green-600'} shadow-lg`} onClick={handleAttackClick} disabled={attack2Used}>
                            ⚔️ Attack 2
                        </Button>
                    </div>
                </div>

                <div className="w-1/2 grid grid-cols-2 gap-6">
                    {enemyBases.map((base, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
                            {getPixelBase(enemyStars[idx])}
                            <span className="mt-2 text-yellow-200 font-medium">🎯 Enemy Base {base}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {showBaseList && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white z-50">
                    <h2 className="text-2xl mb-6 retro-text">🎯 Select Enemy Base to Attack</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {enemyBases.map((base) => (
                            <Button key={base} className="bg-yellow-600 hover:bg-yellow-700 shadow-lg" onClick={() => handleBaseAttack(base)}>
                                ⚔️ Attack Base {base}
                            </Button>
                        ))}
                    </div>
                    <Button className="mt-6 bg-red-600 hover:bg-red-800" onClick={() => setShowBaseList(false)}>
                        ❌ Cancel
                    </Button>
                </div>
            )}

            {showTasks && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white z-50">
                    <h2 className="text-3xl mb-6 retro-text">📋 Mission Objectives</h2>
                    <div className="bg-gray-800 p-6 rounded-xl w-80 mb-4 shadow-lg">
                        <div className="mb-2">✅ Complete 100 Mock Papers</div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${(taskProgress.mocks / 100) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl w-80 mb-6 shadow-lg">
                        <div className="mb-2">📺 Watch 500 Videos</div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${(taskProgress.videos / 500) * 100}%` }}></div>
                        </div>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-800" onClick={() => setShowTasks(false)}>
                        🔙 Close
                    </Button>
                </div>
            )}
        </div>
    );
}