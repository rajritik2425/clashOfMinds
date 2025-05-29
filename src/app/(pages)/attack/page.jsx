"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../utils/AuthContext";
import SearchScreen from "../../components/attack/SearchScreen";
import PreviewScreen from "../../components/attack/PreviewScreen";
import BattleScreen from "../../components/attack/BattleScreen";
import ResultScreen from "../../components/attack/ResultScreen";
import { Castle, Coins, HomeIcon, Shield, Trophy } from "lucide-react";

export default function AttackPage() {
  const { token, user } = useAuth();
  const [gameState, setGameState] = useState("searching");
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [battleBase, setBattleBase] = useState([]);
  const [selectedTroop, setSelectedTroop] = useState(null);
  const [deployedTroops, setDeployedTroops] = useState([]);
  const [destructionPercentage, setDestructionPercentage] = useState(0);
  const [battleTime, setBattleTime] = useState(120);
  const [isAttacking, setIsAttacking] = useState(false);
  const [playerGold, setPlayerGold] = useState(100000);
  const [playerTrophies, setPlayerTrophies] = useState(0);
  const battleInterval = useRef();
  const [attackingCell, setAttackingCell] = useState(null);
  const [attackType, setAttackType] = useState(null);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [destructionEffects, setDestructionEffects] = useState([]);

  // Helper function to check if a structure is accessible (not surrounded)
  const isStructureAccessible = (cellIndex, base) => {
    const gridWidth = 10;
    const gridHeight = 8;
    const row = Math.floor(cellIndex / gridWidth);
    const col = cellIndex % gridWidth;

    // Check all 4 directions (up, down, left, right)
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    let accessibleSides = 0;

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      // Check if the new position is within bounds
      if (
        newRow >= 0 &&
        newRow < gridHeight &&
        newCol >= 0 &&
        newCol < gridWidth
      ) {
        const adjacentIndex = newRow * gridWidth + newCol;
        const adjacentStructure = base[adjacentIndex];

        // If adjacent cell is empty or destroyed, structure is accessible from this side
        if (!adjacentStructure || adjacentStructure.isDestroyed) {
          accessibleSides++;
        }
      }
    }

    // Structure is accessible if it has at least 2 accessible sides
    return accessibleSides >= 2;
  };

  // Helper to get structure icon
  const getStructureIcon = (name) => {
    if (name.includes("Study Hall")) return Castle;
    if (name.includes("Mine")) return Coins;
    if (name.includes("Tower")) return Shield;
    if (name.includes("Arena")) return Trophy;
    return HomeIcon;
  };

  // Helper to get structure color
  const getStructureColor = (name) => {
    if (name.includes("Study Hall")) return "from-purple-600 to-purple-800";
    if (name.includes("Mine")) return "from-yellow-500 to-yellow-700";
    if (name.includes("Tower")) return "from-blue-600 to-blue-800";
    if (name.includes("Arena")) return "from-green-600 to-green-800";
    return "from-gray-600 to-gray-800";
  };

  // Search for opponent
  const searchOpponent = async () => {
    setGameState("searching");
    setDeployedTroops([]);
    setSelectedTroop(null);
    setDestructionPercentage(0);
    setBattleTime(120);

    try {
      if (!token) {
        console.error("No token available");
        return;
      }

      const response = await fetch("/api/attack/find-target", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to find opponent");
      }

      const opponentData = await response.json();

      const opponent = {
        id: opponentData.user.id,
        name: opponentData.user.name,
        trophies: opponentData.user.trophies || 0,
        gold:
          opponentData.base?.resources?.reduce(
            (sum, r) => sum + r.level * 1000,
            0
          ) || 50000,
        elixir:
          opponentData.base?.troops?.reduce(
            (sum, t) => sum + t.level * 500,
            0
          ) || 25000,
      };

      const baseGrid = Array(80).fill(null);
      const gridWidth = 10;

      opponentData.base?.resources?.forEach((structure) => {
        const [row, col] = structure.index;
        const position = row * gridWidth + col;

        baseGrid[position] = {
          id: structure._id,
          name: structure.name,
          icon: getStructureIcon(structure.name),
          color: getStructureColor(structure.name),
          health: structure.health,
          maxHealth: structure.health,
          isDestroyed: false,
          imageURL: structure.imageURL,
        };
      });

      setCurrentOpponent(opponent);
      setBattleBase(baseGrid);
      setGameState("preview");
    } catch (error) {
      console.error("Error searching for opponent:", error);
      setGameState("searching");
      setCurrentOpponent(null);
      setBattleBase([]);
    }
  };

  const fetchUserTroops = async () => {
    try {
      const troopsResponse = await fetch(`/api/troops/${user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!troopsResponse.ok) throw new Error("Failed to fetch troops");

      const troopsData = await troopsResponse.json();
      const mappedTroops = troopsData.map((troop) => ({
        id: troop.id,
        name: troop.name,
        damage: troop.attack,
        health: 100,
        count: troop.quantity,
        cost: 0,
        color: "from-blue-500 to-blue-700",
        imageUrl: troop.image_url,
      }));

      setDeployedTroops(mappedTroops);
    } catch (error) {
      console.error("Error fetching user troops:", error);
    }
  };
  // Create a dummy base for development
  // const createDummyBase = () => {
  //   const base = Array(80).fill(null)

  //   // Place Study Hall at center (4 grids)
  //   const centerPositions = [34, 35, 44, 45]
  //   centerPositions.forEach((pos) => {
  //     base[pos] = {
  //       id: `castle-${pos}`,
  //       name: "Study Hall",
  //       icon: Castle,
  //       color: "from-purple-600 to-purple-800",
  //       health: 500,
  //       maxHealth: 500,
  //       isDestroyed: false,
  //       isMainCastle: true,
  //       imageURL: "https://clash-of-minds.s3.us-west-2.amazonaws.com/structures/study+hall/TOWN_HALL_BASE.png"
  //     }
  //   })

  //   // Add random structures
  //   const structures = [
  //     {
  //       name: "PW Mine",
  //       icon: Coins,
  //       color: "from-yellow-500 to-yellow-700",
  //       health: 100,
  //       imageURL: "https://clash-of-minds.s3.us-west-2.amazonaws.com/GOLD_MINE_IMG.webp"
  //     },
  //     {
  //       name: "Mock Tower",
  //       icon: Shield,
  //       color: "from-blue-600 to-blue-800",
  //       health: 150,
  //       imageURL: "https://clash-of-minds.s3.us-west-2.amazonaws.com/Clock_Tower10.webp"
  //     },
  //     {
  //       name: "DPP Tower",
  //       icon: Shield,
  //       color: "from-red-600 to-red-800",
  //       health: 150,
  //       imageURL: "https://clash-of-minds.s3.us-west-2.amazonaws.com/structures/dpp+tower/Level-1-mock-tower.webp"
  //     },
  //     {
  //       name: "Live Arena",
  //       icon: Trophy,
  //       color: "from-green-600 to-green-800",
  //       health: 200,
  //       imageURL: "https://clash-of-minds.s3.us-west-2.amazonaws.com/structures/live+arena/live+arena+level+1.png"
  //     },
  //   ]

  //   // Place 15-20 random structures
  //   const numStructures = Math.floor(Math.random() * 6) + 15
  //   for (let i = 0; i < numStructures; i++) {
  //     let pos
  //     do {
  //       pos = Math.floor(Math.random() * 80)
  //     } while (base[pos] !== null)

  //     const structure = structures[Math.floor(Math.random() * structures.length)]
  //     base[pos] = {
  //       id: `structure-${pos}`,
  //       name: structure.name,
  //       icon: structure.icon,
  //       color: structure.color,
  //       health: structure.health,
  //       maxHealth: structure.health,
  //       isDestroyed: false,
  //       imageURL: structure.imageURL
  //     }
  //   }

  //   return base
  // }

  const skipOpponent = () => {
    const skipCost = 1000;
    if (playerGold >= skipCost) {
      setPlayerGold((prev) => prev - skipCost);
      searchOpponent();
    }
  };

  const startBattle = () => {
    setGameState("battle");
    setBattleTime(120);
    setDestructionPercentage(0);
    setIsAttacking(false);
    fetchUserTroops();

    battleInterval.current = setInterval(() => {
      setBattleTime((prev) => {
        if (prev <= 1) {
          endBattle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endBattle = async () => {
    if (battleInterval.current) {
      clearInterval(battleInterval.current);
    }
    setGameState("result");
    setIsAttacking(false);

    try {
      if (!token) return;

      const battleResult = {
        opponentId: currentOpponent.id,
        destructionPercentage,
        isVictory: destructionPercentage >= 50,
        destroyedStructures: battleBase
          .filter(
            (structure) =>
              structure && structure.isDestroyed && !structure.isPartOfMain
          )
          .map((structure) => structure.id),
      };

      const response = await fetch(`/api/user/${currentOpponent.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(battleResult),
      });

      if (response.ok) {
        const result = await response.json();
        setPlayerGold((prev) => prev + (result.rewards?.gold || 0));
        setPlayerTrophies((prev) => prev + (result.rewards?.trophies || 0));
      }
    } catch (error) {
      console.error("Error submitting battle results:", error);
    }
  };

  const deployTroop = (cellIndex) => {
    if (!selectedTroop || selectedTroop.count <= 0) return;

    const targetStructure = battleBase[cellIndex];
    if (
      !targetStructure ||
      targetStructure.isDestroyed ||
      targetStructure.isPartOfMain
    )
      return;
    if (!isStructureAccessible(cellIndex, battleBase)) return;

    setIsAttacking(true);
    setAttackingCell(cellIndex);
    setAttackType(selectedTroop.id);

    const damage = selectedTroop.damage;
    setDamageNumbers((prev) => [
      ...prev,
      {
        id: Date.now(),
        damage,
        cellIndex,
        timestamp: Date.now(),
      },
    ]);

    setTimeout(() => {
      const newBase = [...battleBase];
      const target = newBase[cellIndex];

      if (target && !target.isDestroyed) {
        const newHealth = Math.max(0, target.health - damage);
        target.health = newHealth;

        if (newHealth === 0) {
          target.isDestroyed = true;
          setDestructionEffects((prev) => [
            ...prev,
            {
              id: Date.now(),
              cellIndex,
              timestamp: Date.now(),
            },
          ]);
        }

        setBattleBase(newBase);

        // Calculate destruction percentage
        const uniqueStructures = new Set(
          newBase.filter((s) => s && !s.isPartOfMain).map((s) => s.id)
        );
        const destroyedStructures = new Set(
          newBase
            .filter((s) => s && s.isDestroyed && !s.isPartOfMain)
            .map((s) => s.id)
        );
        const newPercentage = Math.floor(
          (destroyedStructures.size / uniqueStructures.size) * 100
        );
        setDestructionPercentage(newPercentage);

        if (newPercentage >= 100) {
          setTimeout(endBattle, 1000);
        }
      }

      setDeployedTroops((prev) =>
        prev.map((t) =>
          t.id === selectedTroop.id && t.count > 0
            ? { ...t, count: t.count - 1 }
            : t
        )
      );

      const updatedTroop = deployedTroops.find(
        (t) => t.id === selectedTroop.id
      );
      if (updatedTroop && updatedTroop.count <= 1) {
        setSelectedTroop(null);
      }

      setIsAttacking(false);
      setAttackingCell(null);
      setAttackType(null);
    }, 1200);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (token) {
      searchOpponent();
    } else {
      console.error("User not authenticated");
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setDamageNumbers((prev) => prev.filter((e) => now - e.timestamp < 2000));
      setDestructionEffects((prev) =>
        prev.filter((e) => now - e.timestamp < 3000)
      );
    }, 100);

    return () => {
      clearInterval(interval);
      if (battleInterval.current) {
        clearInterval(battleInterval.current);
      }
    };
  }, [token]);

  switch (gameState) {
    case "searching":
      return <SearchScreen battleTime={battleTime} />;
    case "preview":
      return (
        <PreviewScreen
          opponent={currentOpponent}
          battleBase={battleBase}
          skipOpponent={skipOpponent}
          startBattle={startBattle}
        />
      );
    case "battle":
      return (
        <BattleScreen
          battleBase={battleBase}
          selectedTroop={selectedTroop}
          deployedTroops={deployedTroops}
          destructionPercentage={destructionPercentage}
          battleTime={battleTime}
          attackingCell={attackingCell}
          attackType={attackType}
          damageNumbers={damageNumbers}
          destructionEffects={destructionEffects}
          endBattle={endBattle}
          deployTroop={deployTroop}
          setSelectedTroop={setSelectedTroop}
          formatTime={formatTime}
          isStructureAccessible={isStructureAccessible}
        />
      );
    case "result":
      return (
        <ResultScreen
          destructionPercentage={destructionPercentage}
          opponent={currentOpponent}
          playerGold={playerGold}
          playerTrophies={playerTrophies}
          nextOpponent={searchOpponent}
        />
      );
    default:
      return null;
  }
}
