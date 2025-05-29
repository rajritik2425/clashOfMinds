'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Shield, Users2, Trophy } from "lucide-react";

export default function JoinClan() {
  const [search, setSearch] = useState("");

  const clans = [
    { name: "Phoenix Blaze", members: 10, capacity: 12, league: "Crystal II", points: 15620 },
    { name: "Shadow Knights", members: 11, capacity: 12, league: "Gold I", points: 14250 },
    { name: "Inferno Rage", members: 8, capacity: 12, league: "Silver III", points: 10340 },
    { name: "Warriors Rise", members: 9, capacity: 12, league: "Bronze I", points: 8740 },
  ];

  const filteredClans = clans.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 font-mono">
      <style>{`
        .retro-text {
          text-shadow: 2px 2px #FF00FF, -2px -2px #00FFFF;
        }
      `}</style>

      <div className="text-center text-4xl font-bold mb-6 retro-text tracking-wide">
        JOIN A CLAN
      </div>

      <div className="flex justify-center mb-8 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clans..."
          className="w-full max-w-md bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button className="bg-green-600 hover:bg-green-500 transition">Search</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredClans.map((clan, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-850 p-5 rounded-xl border border-gray-700 shadow-lg flex justify-between items-center"
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-700 p-3 rounded-full text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">{clan.name}</div>
                <div className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                  <Users2 className="w-4 h-4" />
                  {clan.members}/{clan.capacity} members
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 text-sm">{clan.league}</div>
              <div className="text-green-400 text-sm flex items-center gap-1 justify-end mt-1">
                <Trophy className="w-4 h-4" /> {clan.points} pts
              </div>
              <Button className="mt-3 bg-purple-700 hover:bg-purple-600 px-4 py-1 rounded-full text-sm">
                Join
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
