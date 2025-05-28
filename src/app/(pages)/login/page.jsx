"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Eye,
  EyeOff,
  GamepadIcon,
  Shield,
  Zap,
  Trophy,
  Users,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      <div className="fixed top-10 left-10 opacity-20">
        <GamepadIcon className="w-16 h-16 text-cyan-400 animate-bounce" />
      </div>
      <div className="fixed top-20 right-20 opacity-20">
        <Shield className="w-12 h-12 text-purple-400 animate-pulse" />
      </div>
      <div className="fixed bottom-20 left-20 opacity-20">
        <Zap className="w-14 h-14 text-yellow-400 animate-bounce" style={{ animationDelay: "1s" }} />
      </div>
      <div className="fixed bottom-10 right-10 opacity-20">
        <Trophy className="w-10 h-10 text-amber-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <GamepadIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Game Portal
            </CardTitle>
            <p className="text-slate-400">Login to the game</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="player@gameportal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                </div>
                <Button variant="link" className="text-cyan-400 hover:text-cyan-300 p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 h-12 rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all duration-200"
              >
                <Shield className="w-5 h-5 mr-2" />
                Enter Game
              </Button>
              <p className="text-slate-400 text-center">Don't have an account? <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">Sign up</Link></p>
            </form>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="mt-6 bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-slate-300">Join the Community</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-white">2.5M+</div>
                <div className="text-xs text-slate-400">Players</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-xl font-bold text-white">150K+</div>
                <div className="text-xs text-slate-400">Battles</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white">4.8</div>
                <div className="text-xs text-slate-400">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
