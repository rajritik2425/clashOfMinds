import Link from "next/link";
import { Button } from "./button";

export default function NotAuthenticated(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
              Not Authenticated
            </h2>
            <p className="text-slate-300 mb-6">Please log in to access the game interface.</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      )
}

