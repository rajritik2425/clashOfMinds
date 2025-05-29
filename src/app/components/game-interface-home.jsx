"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  User,
  Trophy,
  Sword,
  Coins,
  Zap,
  HelpCircle,
  ShoppingCart,
  Settings,
  Shield,
  Play,
  Dumbbell,
  LogOut,
  Edit,
  Group,
} from "lucide-react";
import Link from "next/link";
import BattleLogsModal from "./BattleLogsModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import TrainBattleModal from "../components/TrainBattleModal";
import { useAuth } from "../utils/AuthContext";
import Loading from "./ui/loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TrophyBanner from "./TrophyBanner";

export default function HomeGameInterface() {
  const { user, logout, token } = useAuth();
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [trophies, setTrophies] = useState(0);
  const hoverTimeoutRef = useRef(null);
  const isHoveringPopupRef = useRef(false);
  const [buildingsData, setBuildingsData] = useState([]);
  const [challengeCounts, setChallengeCounts] = useState({});
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [gold, setGold] = useState(0);
  const [elixir, setElixir] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showTrophyBanner, setShowTrophyBanner] = useState(false);

  const gridSize = 10;
  const totalCells = gridSize * gridSize;

  const shopItems = [
    {
      id: 1,
      name: "JEE Advanced Batch",
      description: "Complete preparation package for JEE Advanced",
      price: 2999,
      originalPrice: 4999,
      currency: "rupees",
      image: "/images/thumbnail.jpg",
      category: "batch",
      discount: 40,
      purchased: true,
      canUpgrade: true,
      upgradePrice: 1999,
      perks: [
        "+50 Mock tests",
        "+200 Daily practice problems",
        "+30 Recorded lectures",
        "+15 Live classes",
        "+100 Flashcards & notes",
      ],
    },
    {
      id: 2,
      name: "NEET Foundation Batch",
      description: "Foundation course for NEET preparation",
      price: 3999,
      originalPrice: 5999,
      currency: "rupees",
      image: "/images/thumbnail.jpg",
      category: "batch",
      discount: 33,
      purchased: false,
      perks: [
        "+75 Mock tests",
        "+300 Daily practice problems",
        "+45 Recorded lectures",
        "+20 Live classes",
        "+150 Flashcards & notes",
        "+10 Analysis & strategy sessions",
      ],
    },
    {
      id: 3,
      name: "Mathematics Test Series",
      description: "Comprehensive test series for Mathematics",
      price: 1499,
      originalPrice: 2499,
      currency: "rupees",
      image: "/images/thumbnail.jpg",
      category: "test-series",
      discount: 40,
      purchased: false,
      perks: [
        "+25 Mock tests",
        "+100 Daily practice problems",
        "+15 Recorded lectures",
        "+5 Analysis & strategy sessions",
      ],
    },
    {
      id: 4,
      name: "Physics Test Series",
      description: "Advanced test series for Physics concepts",
      price: 1299,
      originalPrice: 1999,
      currency: "rupees",
      image: "/images/thumbnail.jpg",
      category: "test-series",
      discount: 35,
      purchased: true,
      canUpgrade: true,
      upgradePrice: 999,
      perks: [
        "+30 Mock tests",
        "+80 Daily practice problems",
        "+12 Recorded lectures",
        "+8 Live classes",
        "+6 Analysis & strategy sessions",
      ],
    },
  ];

  const fetchBaseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resources/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Initialize empty grid
      const tempGrid = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(null));

      // Place buildings at their correct positions
      data.base.forEach((building) => {
        const [row, col] = building.index;
        tempGrid[row][col] = {
          name: building.name,
          image: building.imageURL,
          level: building.level,
          health: building.health,
          assetId: building.assetId,
          _id: building._id,
        };
      });

      setBuildingsData(tempGrid);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching base data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setGold(userData.gold || 0);
        setElixir(userData.elixir || 0);
        setTrophies(userData.trophies || 0);
      } else {
        console.error("Failed to fetch user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchBaseData();
    }
  }, [user, token]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleCellMouseEnter = (cellIndex) => {
    clearHoverTimeout();
    setHoveredCell(cellIndex);
  };

  const handleCellMouseLeave = () => {
    // Only start the timeout if we're not hovering over the popup
    if (!isHoveringPopupRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCell(null);
      }, 500); // Increased delay for better UX
    }
  };

  const handlePopupMouseEnter = () => {
    clearHoverTimeout();
    isHoveringPopupRef.current = true;
  };

  const handlePopupMouseLeave = () => {
    isHoveringPopupRef.current = false;
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
    }, 200); // Shorter delay when leaving popup
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (buildingsData.length === 0) return null;

  const difficulties = [
    { level: "Easy", image: "/images/easy.webp", points: +5 },
    { level: "Medium", image: "/images/medium.webp", points: +2 },
    { level: "Hard", image: "/images/hard.webp", points: +1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <Button
                size="lg"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30">
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm text-slate-300">Signed in as</p>
                    <p className="text-white font-medium truncate">
                      {user?.name}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-amber-500/30 font-bold"
                  onClick={() => setShowTrophyBanner(true)}>
                  <div className="flex gap-2 items-center">
                    <Trophy className="w-4 h-4" />
                    <span>Trophies</span>
                    <span className="text-amber-400 font-bold">{trophies}</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Link href="/attack">
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-red-500/30 font-bold">
                    <Sword className="w-4 h-4 mr-2" />
                    Attack
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowTrainModal(true)}
                  variant="outline"
                  className="w-full bg-green-500 hover:from-yellow-600 hover:to-orange-600 text-white border-yellow-400/30 font-bold">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Train
                </Button>
              </CardContent>
              <div className="flex justify-around p-1">
                {difficulties.map((d) => (
                  <div
                    key={d.level}
                    className="cursor-pointer p-1 border border-yellow-400 rounded-lg bg-slate-800 hover:bg-yellow-900/20 text-center w-full">
                    <Image
                      src={d.image}
                      alt={d.level}
                      width={30}
                      height={30}
                      className="mx-auto mb-2"
                    />
                    <p className="font-bold text-xs">{d.level}</p>
                    <p className="text-yellow-400 text-xs">Count: {d.points}</p>
                  </div>
                ))}
              </div>
            </Card>
            <TrainBattleModal
              showModal={showTrainModal}
              setShowModal={setShowTrainModal}
            />

            {/* Battle Stats */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wide">
                  Battle Stats
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Wins</span>
                    <span className="text-green-400 font-bold">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Losses</span>
                    <span className="text-red-400 font-bold">23</span>
                  </div>
                  <span
                    onClick={() => {
                      setShowModal(true);
                    }}
                    className="text-sm cursor-pointer underline text-blue-200">
                    📜 View Battle Logs
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <BattleLogsModal showModal={showModal} setShowModal={setShowModal} />

          {/* Main Game Area */}
          <div className="lg:col-span-8">
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
              <CardContent className="pt-6 pb-0 pr-0 pl-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                    BASE STRUCTURE
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-10 gap-1 p-4 bg-slate-900/50 rounded-2xl border border-slate-600/30">
                  {Array.from({ length: totalCells }, (_, i) => {
                    const row = Math.floor(i / gridSize);
                    const col = i % gridSize;
                    const building = buildingsData[row][col];

                    return (
                      <div
                        key={i}
                        className={`
                          p-1 aspect-square border border-slate-600/50 rounded-lg transition-all duration-200 relative
                          ${
                            hoveredCell === i
                              ? "bg-slate-700/50 border-slate-500 cursor-pointer"
                              : "bg-slate-800/30 hover:bg-slate-700/50 cursor-pointer"
                          }
                        `}
                        onMouseEnter={() => handleCellMouseEnter(i)}
                        onMouseLeave={handleCellMouseLeave}>
                        {building && (
                          <img
                            src={building.image || "/placeholder.svg"}
                            alt={building.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        {hoveredCell === i && building && (
                          <div
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 w-48"
                            onMouseEnter={handlePopupMouseEnter}
                            onMouseLeave={handlePopupMouseLeave}>
                            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-xl shadow-black/50">
                              {building.name === "PW Mine" ? (
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg shadow-yellow-500/25 border border-yellow-400/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add gold collection logic here
                                    console.log("Collecting gold from PW Mine");
                                  }}>
                                  <Coins className="w-3 h-3 mr-1" />
                                  Collect Gold
                                </Button>
                              ) : building.name === "Elixir Collector" ? (
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg shadow-purple-500/25 border border-purple-400/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add elixir collection logic here
                                    console.log(
                                      "Collecting elixir from Elixir Collector"
                                    );
                                  }}>
                                  <Zap className="w-3 h-3 mr-1" />
                                  Collect Elixir
                                </Button>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 p-1">
                                      <img
                                        src={
                                          building.image || "/placeholder.svg"
                                        }
                                        alt={building.name}
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-white">
                                        {building.name}
                                      </div>
                                      <div className="text-xs text-slate-300">
                                        Level {building.level}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-slate-400">
                                        Health
                                      </span>
                                      <span className="text-green-400 font-medium">
                                        {building.health}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-slate-400">
                                        Upgrade Level
                                      </span>
                                      <span className="text-yellow-400 font-medium">
                                        {challengeCounts[building.assetId] || 0}
                                        /10
                                      </span>
                                    </div>
                                  </div>

                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg shadow-orange-500/25 border border-orange-400/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const assetId = building.assetId;
                                      setChallengeCounts((prev) => {
                                        const currentCount = prev[assetId] || 0;
                                        const newCount = currentCount + 1;
                                        return newCount >= 10
                                          ? { ...prev, [assetId]: 0 }
                                          : { ...prev, [assetId]: newCount };
                                      });
                                    }}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    Accept Challenge
                                  </Button>
                                </>
                              )}

                              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/95" />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/95" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Resource Details */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs text-slate-400 uppercase tracking-wide">
                  Resources
                </div>

                <div className="space-y-4">
                  {/* Gold */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-300">Gold</span>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        {gold} / 1000
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width: `${Math.min((gold / 1000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Elixir */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Elixir</span>
                      </div>
                      <span className="text-purple-400 font-bold">
                        {elixir} / 1000
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-purple-400 rounded-full"
                        style={{
                          width: `${Math.min((elixir / 1000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Hints */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">Hints</span>
                      </div>
                      <span className="text-blue-400 font-bold">10 / 50</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: "20%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/25 border border-green-400/30"
                  onClick={() => setShowShopModal(true)}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <Link href="base-edit">
                <CardContent className="p-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-500/25 border border-green-400/30">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <Link href="clan">
                <CardContent className="p-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-500/25 border border-green-400/30">
                    <Group className="w-5 h-5 mr-2" />
                    Clan
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Quick Actions */}
            {/* <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wide">
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                    Build
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                    Upgrade
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                    Move
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
        {/* Shop Modal */}
        <Dialog open={showShopModal} onOpenChange={setShowShopModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                🛒 Game Shop
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-6 max-h-96 overflow-y-auto pr-2 ">
              {shopItems.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-all duration-200 relative ${
                    item.purchased ? "border-green-500/50 bg-green-900/20" : ""
                  }`}>
                  {item.discount && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold">
                      -{item.discount}% OFF
                    </Badge>
                  )}
                  {item.purchased && (
                    <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                      PURCHASED
                    </Badge>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg bg-slate-600/50 p-2 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {item.name}
                            </h3>
                            <p className="text-sm text-slate-300 mt-1">
                              {item.description}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-500 text-slate-300 mt-2">
                              {item.category}
                            </Badge>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                              <span className="text-lg font-bold text-white">
                                ₹{item.price}
                              </span>
                            </div>
                            {item.canUpgrade && (
                              <div className="text-sm text-yellow-400 mt-1">
                                Upgrade: ₹{item.upgradePrice}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Perks Section */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            What you get:
                          </h4>
                          <div className="grid grid-cols-2 gap-1">
                            {item.perks.map((perk, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-xs text-slate-400">
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {item.purchased ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-green-500 text-green-400 hover:bg-green-500/20"
                                disabled>
                                ✓ Purchased
                              </Button>
                              {item.canUpgrade && (
                                <Button
                                  size="sm"
                                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold"
                                  onClick={() => {
                                    console.log(
                                      `Upgrading: ${item.name} for ₹${item.upgradePrice}`
                                    );
                                  }}>
                                  Upgrade Now
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                              onClick={() => {
                                console.log(
                                  `Purchased: ${item.name} for ₹${item.price}`
                                );
                              }}>
                              Buy Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        {/* Trophy Banner Dialog */}
        <Dialog open={showTrophyBanner} onOpenChange={setShowTrophyBanner}>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 mb-2 text-center">
                🏆 Trophy Medals
              </DialogTitle>
            </DialogHeader>
            <TrophyBanner />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
