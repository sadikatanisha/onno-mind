"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="border-b border-slate-800/50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500">
            <Sparkles className="h-5 w-5 text-slate-900" />
          </div>
          <span className="text-xl font-semibold text-white">OnnoMind</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white">
            Pricing
          </Link>
          <Link href="#docs" className="text-sm font-medium text-gray-300 hover:text-white">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="text-white hover:bg-slate-800">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
