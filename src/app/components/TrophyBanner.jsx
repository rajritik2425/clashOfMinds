import React from "react"
import Image from "next/image"

const medals = [
    {
      name: "Bronze",
      image: "/bronze.png",
      trophies: 400,
      color: "#cd7f32",
    },
    {
      name: "Silver",
      image: "/silver.png",
      trophies: 800,
      color: "#b0b0b0",
    },
    {
      name: "Gold",
      image: "/gold.png",
      trophies: 1400,
      color: "#ffd700",
    },
    {
      name: "Master",
      image: "/master.png",
      trophies: 2000,
      color: "#6e4aff",
    },
  ]
  

export default function TrophyBanner() {
  return (
    <div className="flex flex-row justify-center items-center gap-8 py-6 px-2">
      {medals.map((medal, idx) => (
        <div
          key={medal.name}
          className="flex flex-col items-center animate-medal"
          style={{
            animationDelay: `${idx * 0.15}s`,
          }}
        >
          <div
            className="rounded-full shadow-lg p-2 bg-slate-900"
            style={{ border: `3px solid ${medal.color}` }}
          >
            <Image
              src={medal.image}
              alt={medal.name}
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="mt-2 text-lg font-bold" style={{ color: medal.color }}>
            {medal.name}
          </div>
          <div className="text-slate-300 text-sm font-medium">
            {medal.trophies}+ Trophies
          </div>
        </div>
      ))}
      <style jsx>{`
        .animate-medal {
          opacity: 0;
          transform: scale(0.8);
          animation: fadeInScale 0.5s forwards;
        }
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
} 