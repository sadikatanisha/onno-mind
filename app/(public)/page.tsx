import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function LandingPage() {
  const companies = ["ACME Corp", "TechFlow", "DataVerse", "Nexus AI"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 text-center">
        <h1 className="mb-6 text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-purple-600 bg-clip-text text-transparent">
            Your Knowledge, Amplified by AI
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
          Upload documents, ask questions, get intelligent insights—all in one beautiful workspace
        </p>

        <div className="mb-3 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-purple-600 text-base hover:bg-purple-700">
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-700 text-base text-white hover:bg-slate-800"
          >
            <Link href="#demo">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Link>
          </Button>
        </div>

        <p className="mb-20 text-sm text-gray-500">
          No credit card required • 14-day trial
        </p>

        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Trusted by 10,000+ teams
          </p>
          <div className="flex items-center justify-center gap-12">
            {companies.map((company) => (
              <span key={company} className="text-lg font-semibold text-gray-600">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
