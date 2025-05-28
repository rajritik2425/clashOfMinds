'use client';
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';

const StrategyPage = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const router = useRouter();
  const {isAuthenticated} = useAuth();
  if(!isAuthenticated){
    router.push('/login');
  }
  
  // Mock data - in a real app this would come from strategyData.json
  const strategyData = [
    {
      id: 1,
      question: "What is the derivative of x²?",
      source: "Calculus Exam",
      topic: "Derivatives",
      explanation: "The derivative of x² is 2x. This follows the power rule where d/dx[x^n] = n*x^(n-1).",
      isCorrect: false
    },
    {
      id: 2,
      question: "Solve 2x + 5 = 15",
      source: "Algebra Quiz",
      topic: "Linear Equations",
      explanation: "Subtract 5 from both sides: 2x = 10. Then divide both sides by 2: x = 5.",
      isCorrect: false
    },
    {
      id: 3,
      question: "What is the area of a circle with radius 5?",
      source: "Geometry Test",
      topic: "Circles",
      explanation: "The area formula is πr². So for r=5, area = π*25 ≈ 78.54.",
      isCorrect: false
    },
    {
      id: 4,
      question: "Simplify √(16x⁴)",
      source: "Algebra Exam",
      topic: "Radicals",
      explanation: "√(16x⁴) = √16 * √(x⁴) = 4 * x² = 4x².",
      isCorrect: false
    },
    {
      id: 5,
      question: "Solve for x: log₂(x) = 4",
      source: "Precalculus Quiz",
      topic: "Logarithms",
      explanation: "Convert to exponential form: 2⁴ = x, so x = 16.",
      isCorrect: false
    },
    {
      id: 6,
      question: "What is the value of sin(π/2)?",
      source: "Trigonometry Test",
      topic: "Trig Functions",
      explanation: "sin(π/2) = 1. This is a standard value on the unit circle.",
      isCorrect: false
    },
  ];

  const incorrectQuestions = strategyData.filter(q => !q.isCorrect);

  // Calculate topic mistake counts
  const topicMistakeCount = incorrectQuestions.reduce((acc, curr) => {
    acc[curr.topic] = (acc[curr.topic] || 0) + 1;
    return acc;
  }, {});

  // Strategy recommendations per topic
  const topicStrategies = {
    "Derivatives": {
      resources: ["Khan Academy - Derivatives", "Paul's Online Math Notes"],
      practice: "Complete 20 derivative problems focusing on power rule and chain rule",
      challenge: "Derivatives Mastery Challenge: Solve 10 complex derivative problems in under 15 minutes"
    },
    "Linear Equations": {
      resources: ["Brilliant - Linear Equations", "MathIsFun Algebra Section"],
      practice: "Solve 15 linear equations with variables on both sides",
      challenge: "Equation Rush: Solve 20 linear equations in under 10 minutes"
    },
    "Circles": {
      resources: ["GeoGebra Circle Tutorials", "CK-12 Geometry"],
      practice: "Calculate areas and circumferences for 10 different circles",
      challenge: "Circle Geometry Gauntlet: Solve 5 multi-step circle problems"
    },
    "Radicals": {
      resources: ["PurpleMath - Radicals", "Math Planet Simplifying Radicals"],
      practice: "Simplify 15 radical expressions of varying complexity",
      challenge: "Radical Simplification Sprint: Simplify 10 expressions in under 8 minutes"
    },
    "Logarithms": {
      resources: ["PatrickJMT - Logarithms", "Interactive Logarithms"],
      practice: "Solve 15 logarithmic equations of different bases",
      challenge: "Logarithmic Decoder: Solve 5 complex logarithmic equations"
    },
    "Trig Functions": {
      resources: ["Trigonometry Bootcamp", "Unit Circle Interactive"],
      practice: "Memorize unit circle values and solve 10 trig equations",
      challenge: "Trig Triathlon: Solve 15 trig problems covering all functions"
    }
  };

  useEffect(() => {
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(topicMistakeCount),
          datasets: [
            {
              label: 'Mistakes per Topic',
              data: Object.values(topicMistakeCount),
              backgroundColor: [
                '#facc15',
                '#f97316',
                '#ef4444',
                '#a855f7',
                '#3b82f6',
                '#10b981'
              ],
              borderColor: '#fde047',
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Battle Weakness Report',
              color: '#fde047',
              font: {
                size: 16,
                family: "'Orbitron', sans-serif"
              }
            }
          },
          scales: {
            x: { 
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#cbd5e1' }
            },
            y: { 
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#cbd5e1' }
            }
          }
        }
      });
    }
  }, []);

  const filteredQuestions = selectedTopic 
    ? incorrectQuestions.filter(q => q.topic === selectedTopic)
    : incorrectQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 md:p-8 font-sans">
      {/* Gaming-themed header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 rounded-lg"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 font-orbitron tracking-wide relative z-10">
          🧠 STRATEGY COMMAND CENTER
        </h1>
        <p className="text-blue-300 mb-4 relative z-10">
          Analyze your weaknesses and devise your battle plan for academic domination
        </p>
        
        <div className="flex justify-center gap-4 mb-6 relative z-10">
          <Button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeTab === 'questions' 
                ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/40' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            📋 Question Analysis
          </Button>
          <Button 
            onClick={() => setActiveTab('battleplan')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeTab === 'battleplan' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            🎯 Battle Plans
          </Button>
          <Button 
            onClick={() => setActiveTab('challenges')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeTab === 'challenges' 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            ⚔️ Elite Challenges
          </Button>
        </div>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button 
          onClick={() => setSelectedTopic(null)}
          className={`px-4 py-2 rounded-lg ${
            selectedTopic === null 
              ? 'bg-yellow-500 text-gray-900 font-bold' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          All Topics
        </Button>
        {Object.keys(topicMistakeCount).map(topic => (
          <Button 
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-lg ${
              selectedTopic === topic 
                ? 'bg-yellow-500 text-gray-900 font-bold' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {topic} ({topicMistakeCount[topic]})
          </Button>
        ))}
      </div>

      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {filteredQuestions.map((q, i) => (
            <div key={q.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500 rounded-xl p-5 shadow-lg hover:shadow-yellow-500/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⚔️ BATTLE #{i + 1}
                </div>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  {q.topic}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-3 text-yellow-300">📌 {q.question}</h2>
              <p className="text-sm mb-2 text-blue-300">📚 Source: {q.source}</p>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-3 border-l-4 border-green-500">
                <p className="text-green-300">
                  <span className="font-bold">🧠 Explanation:</span> {q.explanation}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 rounded-lg border border-purple-500">
                <p className="text-yellow-200">
                  <span className="font-bold">🎯 Strategy Tip:</span> Revise <strong>{q.topic}</strong> with specialized practice. Unlock the <strong className="text-yellow-400">Elite Troop Challenge</strong> for bonus XP!
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'battleplan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {Object.entries(topicMistakeCount).sort((a, b) => b[1] - a[1]).map(([topic, count]) => (
            <div key={topic} className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500 rounded-xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-300">{topic}</h3>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  {count} {count === 1 ? 'Mistake' : 'Mistakes'}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⚔️ Battle Strategy:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Focus on core concepts for 45 minutes daily</li>
                  <li>Complete 10 practice problems each day</li>
                  <li>Review mistakes immediately after practice</li>
                  <li>Seek help from mentors for persistent issues</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="text-green-400 font-semibold mb-2">📚 Recommended Resources:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {topicStrategies[topic]?.resources.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-3 rounded-lg border border-purple-500">
                <h4 className="text-yellow-300 font-semibold mb-1">🎯 Mission Objective:</h4>
                <p className="text-gray-200">{topicStrategies[topic]?.practice}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries(topicMistakeCount).sort((a, b) => b[1] - a[1]).map(([topic, count]) => (
            <div key={topic} className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-red-500 rounded-xl p-5 shadow-lg hover:shadow-red-500/20 transition-all">
              <div className="text-center mb-4">
                <div className="bg-red-500 text-white inline-block px-4 py-1 rounded-full mb-2 font-bold">
                  ELITE CHALLENGE
                </div>
                <h3 className="text-xl font-bold text-yellow-300">{topic} Mastery</h3>
              </div>
              
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{count}</div>
                  <div className="text-sm text-gray-400">Mistakes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">5</div>
                  <div className="text-sm text-gray-400">Levels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">250</div>
                  <div className="text-sm text-gray-400">XP Reward</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⚔️ Challenge:</h4>
                <p className="text-gray-300">{topicStrategies[topic]?.challenge}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-3 rounded-lg border border-yellow-500 mb-4">
                <h4 className="text-yellow-300 font-semibold mb-1">🏆 Rewards:</h4>
                <ul className="list-disc list-inside text-gray-200">
                  <li>250 XP for completion</li>
                  <li>Mastery Badge for your profile</li>
                  <li>Unlock next difficulty tier</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-red-600 to-yellow-600 text-white py-2 rounded-lg font-bold hover:from-red-700 hover:to-yellow-700 transition-all">
                ACCEPT CHALLENGE
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Performance Chart */}
      <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-yellow-500 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">📊 BATTLE WEAKNESS REPORT</h2>
          <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            {incorrectQuestions.length} MISTAKES ANALYZED
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <canvas id="performanceChart" className="w-full h-64"></canvas>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-500">
            <h3 className="text-lg font-bold text-blue-300 mb-2">🛡️ DEFENSE STRATEGY</h3>
            <p className="text-gray-300">
              Focus your training on high-mistake areas to strengthen your defenses against these topics.
              Allocate 60% of your study time to the top three weakness areas.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-4 rounded-lg border border-purple-500">
            <h3 className="text-lg font-bold text-purple-300 mb-2">⚔️ OFFENSE STRATEGY</h3>
            <p className="text-gray-300">
              Launch targeted attacks on your weaknesses by completing Elite Challenges. 
              Each challenge conquered earns you XP and brings you closer to total academic domination!
            </p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border-2 border-green-500 p-5">
        <div className="flex justify-between mb-3">
          <span className="text-green-400 font-bold">ACADEMIC WARRIOR</span>
          <span className="text-yellow-400 font-bold">LEVEL 7</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-yellow-500 h-4 rounded-full" 
            style={{ width: '65%' }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>1,250/2,000 XP</span>
          <span>Next Level: Battle Master</span>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default StrategyPage;