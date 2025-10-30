import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Globe, Zap, Target, TrendingUp } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">OnnoMind</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-slate-300">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-purple-600 hover:bg-purple-700">Get Started Free</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300 mb-4">
            <Sparkles className="h-4 w-4" />
            Powered by You.com AI with Real-Time Web Search
          </div>
          
          <h1 className="text-6xl font-bold text-white leading-tight">
            Learn Anything with<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI-Powered Flashcards
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Chat with an AI tutor that searches the web in real-time, automatically generates flashcards with citations, 
            and quizzes you to master any topic.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Web Search</h3>
            <p className="text-slate-400">
              Our AI searches the latest information from the web and cites authoritative sources. 
              Always learning from current, accurate content.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auto-Generated Flashcards</h3>
            <p className="text-slate-400">
              Just chat about what you want to learn. We automatically extract key concepts 
              and create citation-backed flashcards.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Tutor Quiz Mode</h3>
            <p className="text-slate-400">
              Practice with an interactive AI tutor that asks questions, 
              gives feedback, and adapts to your learning pace.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-10 text-center">
          <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            The Ultimate Learning Flow
          </h2>
          <div className="flex items-center justify-center gap-4 text-lg text-slate-300 flex-wrap">
            <span>💬 Chat & Learn</span>
            <span className="text-purple-400">→</span>
            <span>🎴 Generate Flashcards</span>
            <span className="text-purple-400">→</span>
            <span>Choose: 📚 Review or 🧠 Quiz</span>
          </div>
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            All your flashcards are backed by real web sources. See exactly where the information 
            came from and trust what you're learning.
          </p>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>Built with You.com AI • Featuring real-time web search and RAG-powered learning</p>
        </div>
      </footer>
    </div>
  );
}
