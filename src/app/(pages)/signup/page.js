"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Eye,
  EyeOff,
  GamepadIcon,
  Shield,
  Zap,
  Trophy,
  Users,
  Star,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [course, setCourse] = useState("") // Initialize state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // ... validateForm remains the same ...

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")

    // if (!validateForm()) {
    //   return
    // }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone,
          password,
          course
        }),
      })

      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error(await response.text());
      }

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${data.error || response.status}`);
      }

      // Store the token
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify({
          name,
          email,
          course
        }))
      }

      // Redirect to login page after successful signup
      router.push("/login")
    } catch (error) {
      console.error("Signup error:", error)
      if (error.message === "Failed to fetch") {
        setError("Unable to connect to the server. Please check your internet connection and try again.")
      } else {
        setError(error.message || "Failed to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      {/* Animated background icons */}
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
            <p className="text-slate-400">Sign up to the game</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                  required
                  disabled={isLoading}
                />
              </div>

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
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course" className="text-slate-300 font-medium">
                  Course Name
                </Label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-md h-12 px-3 pr-8 focus:border-cyan-500 focus:ring-cyan-500/20 appearance-none bg-no-repeat bg-[length:20px] bg-[right_8px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23CBD5E1%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a course</option>
                  <option value="jee">JEE</option>
                  <option value="neet">NEET</option>
                  <option value="upsc">UPSC</option>
                  <option value="class1">Class 1</option>
                </select>
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
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 h-12 rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Enter Game
                  </>
                )}
              </Button>
              <p className="text-slate-400 text-center">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-cyan-400 hover:text-cyan-300"
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  Login
                </Link>
              </p>
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
