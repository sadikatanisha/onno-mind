import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Crown, Zap, Brain, MessageSquare, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) redirect("/sign-in");

  // Mock data - implement logic later
  const subscriptionPlan = "Free";
  const quizzesUsed = 5;
  const quizzesLimit = 10;
  const flashcardsCreated = 45;
  const studyStreak = 3;

  const usagePercentage = (quizzesUsed / quizzesLimit) * 100;

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-slate-400 mt-1">Here's your learning overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <Badge variant="outline" className="text-sm border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
              {subscriptionPlan} Plan
            </Badge>
          </div>
        </div>

        {/* Subscription & Usage Card */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-slate-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white text-2xl">Your Subscription</CardTitle>
                <CardDescription className="text-slate-300 mt-2">
                  {subscriptionPlan} Plan - Upgrade to unlock unlimited quizzes
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm font-medium">AI Quizzes This Month</span>
                <span className="text-white font-semibold">
                  {quizzesUsed} / {quizzesLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                {quizzesLimit - quizzesUsed} quizzes remaining
              </p>
            </div>

            {usagePercentage >= 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ You're running low on quizzes. Upgrade to Pro for unlimited access!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Flashcards</CardTitle>
              <Brain className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{flashcardsCreated}</div>
              <p className="text-xs text-slate-500 mt-1">Created from AI conversations</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Quizzes Taken</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{quizzesUsed}</div>
              <p className="text-xs text-slate-500 mt-1">AI-powered practice sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{studyStreak} days</div>
              <p className="text-xs text-slate-500 mt-1">Keep it going! 🔥</p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                Free Plan
              </CardTitle>
              <CardDescription>Current plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                10 AI quizzes per month
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Unlimited flashcards
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Basic AI chat
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                Limited to 3 decks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Pro Plan
              </CardTitle>
              <CardDescription className="text-purple-300">Unlock your full potential</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Unlimited AI quizzes
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Unlimited flashcards
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Advanced AI chat with GPT-4
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Unlimited decks
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Priority support
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
