"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Modal  from "../components/ui/modal";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Trophy, Target, Coins, Shield, Dumbbell, Sword,
  ShoppingCart, User, Lightbulb, ChevronLeft, ChevronRight,
} from "lucide-react";

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to Clash Of Minds!",
    description:
      "This is your educational base! Build your knowledge empire, collect resources, and battle through academic challenges.",
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    tips: [
      "Strategy game focused on learning",
      "Complete challenges to upgrade buildings",
      "Collect resources to unlock content",
    ],
  },
  {
    id: 2,
    title: "Your Base Grid",
    description:
      "The 10x10 grid is your base. Each building has a purpose and can be upgraded through challenges.",
    icon: <Target className="w-6 h-6 text-blue-400" />,
    highlight: "base-grid",
    tips: [
      "Hover buildings to see details",
      "Each building offers unique challenges",
      "Complete 3 challenges to upgrade",
    ],
  },
  {
    id: 3,
    title: "Resource Management",
    description:
      "Gold (for challenges), Elixir (for powers), and Hints (for help) are your core resources.",
    icon: <Coins className="w-6 h-6 text-yellow-400" />,
    highlight: "resources",
    tips: ["Gold: Use in challenges", "Elixir: From collectors", "Hints: Solve problems"],
  },
  {
    id: 4,
    title: "Building Challenges",
    description:
      "Click on buildings to solve problems and upgrade. Each offers different learning methods.",
    icon: <Shield className="w-6 h-6 text-green-400" />,
    highlight: "buildings",
    tips: [
      "Revision Lab: Notes",
      "DPP Tower: Daily practice",
      "Mock Tower: Full tests",
      "Live Arena: Live lectures",
    ],
  },
  {
    id: 5,
    title: "Training System",
    description:
      "Use 'Train' to practice problems. Higher difficulties earn better rewards.",
    icon: <Dumbbell className="w-6 h-6 text-green-400" />,
    highlight: "train",
    tips: ["Easy: +5 points", "Medium: +2", "Hard: +1 (max challenge)"],
  },
  {
    id: 6,
    title: "Battle System",
    description:
      "Attack other players’ bases by solving faster! Earn trophies and climb the leaderboard.",
    icon: <Sword className="w-6 h-6 text-red-400" />,
    highlight: "attack",
    tips: ["Win to earn trophies", "Climb ranks"],
  },
  {
    id: 7,
    title: "Shop & Upgrades",
    description:
      "Buy study packs, test series, and video courses from the Shop to boost progress.",
    icon: <ShoppingCart className="w-6 h-6 text-green-400" />,
    highlight: "shop",
    tips: ["Buy with real money", "Unlock premium content"],
  },
  {
    id: 8,
    title: "Profile & Progress",
    description:
      "Track your stats, battles, and progress through your profile page.",
    icon: <User className="w-6 h-6 text-blue-400" />,
    highlight: "profile",
    tips: ["View progress", "Manage settings"],
  },
  {
    id: 9,
    title: "Advanced Features",
    description:
      "Unlock base editing, clans, battle logs, and trophies as you progress.",
    icon: <Lightbulb className="w-6 h-6 text-purple-400" />,
    highlight: "advanced",
    tips: ["Join clans", "Earn badges", "Review battles"],
  },
];

export default function GuideModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  useEffect(() => {
    const highlightId = step.highlight;
    if (highlightId) {
      const el = document.getElementById(highlightId);
      if (el) {
        el.classList.add("ring-4", "ring-yellow-400", "z-50", "rounded-lg");
        return () => el.classList.remove("ring-4", "ring-yellow-400", "z-50", "rounded-lg");
      }
    }
  }, [step]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="bg-slate-900 text-white border border-slate-700 shadow-2xl w-full max-w-2xl mx-auto">
        <CardHeader className="flex justify-between items-center border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2">
            {step.icon}
            <CardTitle className="text-lg sm:text-xl">{step.title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <p className="text-sm text-gray-300">{step.description}</p>

          <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
            {step.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>

          {/* Progress indicators */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {tutorialSteps.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentStep ? "bg-yellow-400 scale-125" : "bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Finish
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(tutorialSteps.length - 1, prev + 1))}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
