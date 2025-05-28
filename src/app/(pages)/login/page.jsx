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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password, rememberMe })
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
            <p className="text-slate-400 mt-2">Enter the battlefield</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium">
                  Email or Username
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
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-slate-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                    Remember me
                  </Label>
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
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-800 px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 h-12"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.35 11.1H12v2.8h5.35c-.2 1.1-.8 2-1.7 2.65v2.2h2.75c1.6-1.5 2.5-3.75 2.5-6.5 0-.35-.05-.7-.15-1z"/>
                  <path d="M12 21c2.4 0 4.45-.8 5.95-2.1l-2.75-2.2c-.75.5-1.7.8-2.7.8-2.1 0-3.9-1.4-4.55-3.3H5.1v2.1C6.55 19.15 9.1 21 12 21z"/>
                  <path d="M7.45 13.2c-.15-.45-.25-.95-.25-1.45s.1-1 .25-1.45V8.2H5.1c-.55 1.05-.9 2.25-.9 3.55s.35 2.5.9 3.55l2.35-1.1z"/>
                  <path d="M12 6.15c.9 0 1.7.3 2.35.85l1.7-1.7C15.1 4.25 13.6 3.75 12 3.75c-2.9 0-5.45 1.85-6.9 4.45l2.35 1.1c.65-1.9 2.45-3.3 4.55-3.3z"/>
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                className="bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 h-12"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.02 0C5.4 0 .03 5.37.03 11.99c0 5.08 3.16 9.42 7.61 11.17-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.96-2.91 2.17-2.91 1.03 0 1.52.77 1.52 1.69 0 1.03-.65 2.57-.99 3.99-.29 1.19.6 2.16 1.77 2.16 2.13 0 3.77-2.24 3.77-5.49 0-2.86-2.06-4.87-5.01-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.4 2.14.89 2.74.1.12.11.23.08.34-.09.38-.29 1.2-.33 1.36-.05.23-.17.27-.4.17-1.5-.69-2.5-2.85-2.5-4.59 0-3.73 2.71-7.17 7.83-7.17 4.1 0 7.29 2.93 7.29 6.86 0 4.07-2.57 7.34-6.14 7.34-1.2 0-2.34-.62-2.72-1.36l-.74 2.83c-.27 1.03-1 2.33-1.5 3.12 1.12.35 2.3.54 3.54.54 6.62 0 12-5.37 12-12S18.64 0 12.02 0z"/>
                </svg>
                GitHub
              </Button>
            </div>
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
