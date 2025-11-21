"use client"

import { useState, useEffect } from "react"
import { TeamSidebar } from "@/components/team-sidebar"
import { TopBar } from "@/components/top-bar"
import { BottomPanel } from "@/components/bottom-panel"
import { ChartArea } from "@/components/chart-area"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2 } from "lucide-react"
import { useGame, useLatestGame, useGamePlayers, useCreateGame } from "@/lib/supabase/hooks"
import { runTestMode } from "@/lib/test-mode" // Import runTestMode

export default function Page() {
  const supabase = createClient()
  const [isConfigured, setIsConfigured] = useState(true)
  const [testMode, setTestMode] = useState(false) // Add testMode state
  const [timeLeft, setTimeLeft] = useState(0) // Add local timeLeft state
  const { gameId, loading: latestGameLoading } = useLatestGame()
  const { game, loading: gameLoading } = useGame(gameId)
  const { players, loading: playersLoading } = useGamePlayers(gameId)
  const { createGame, loading: createGameLoading } = useCreateGame()

  useEffect(() => {
    if (!supabase) {
      setIsConfigured(false)
    }
  }, [supabase])

  // Create a default game if none exists
  useEffect(() => {
    if (!latestGameLoading && !gameId && !createGameLoading) {
      createGame()
    }
  }, [latestGameLoading, gameId, createGameLoading, createGame])

  // Timer Logic
  useEffect(() => {
    if (!game?.phaseEndsAt) return

    const interval = setInterval(() => {
      const endsAt = new Date(game.phaseEndsAt).getTime()
      const now = Date.now()
      const diff = Math.max(0, Math.floor((endsAt - now) / 1000))
      setTimeLeft(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [game?.phaseEndsAt])

  // Test Mode Logic: Auto-advance phases and run bots
  useEffect(() => {
    if (!testMode || !game || !supabase) return

    const handleTestMode = async () => {
      // Run bot actions for current phase
      await runTestMode(game.id, game.phase, supabase)

      // Auto-advance phase if time is up
      if (timeLeft <= 0) {
        const nextPhase = getNextPhase(game.phase)
        const duration = 15 // 15 seconds for test mode

        // Calculate new end time
        const newEndsAt = new Date(Date.now() + duration * 1000).toISOString()

        // Update game state
        await supabase
          .from("games")
          .update({
            phase: nextPhase,
            phase_ends_at: newEndsAt,
            // Reveal condition in SOLO_BETTING
            condition_revealed: nextPhase === "SOLO_BETTING" || nextPhase === "RACE" || nextPhase === "RESULTS",
          })
          .eq("id", game.id)

        // If looping back to JOINING, maybe reset pot or create new game?
        // For simplicity, we'll just loop phases in same game or let createGame handle new one if we set phase to 'FINISHED'
        // But getNextPhase handles the cycle.
      }
    }

    const interval = setInterval(handleTestMode, 1000)
    return () => clearInterval(interval)
  }, [testMode, game, timeLeft, supabase])

  // Helper to get next phase
  const getNextPhase = (current: string) => {
    const phases = ["JOINING", "TEAM_BETTING", "PROMPTS", "SOLO_BETTING", "RACE", "RESULTS"]
    const idx = phases.indexOf(current)
    if (idx === -1 || idx === phases.length - 1) return "JOINING"
    return phases[idx + 1]
  }

  if (!isConfigured) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-red-500/50 bg-red-950/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-red-500">Configuration Required</h2>
          <p className="text-gray-400">
            Supabase environment variables are missing. Please check the "Vars" section in the sidebar and ensure
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
          </p>
        </div>
      </div>
    )
  }

  if (latestGameLoading || (gameLoading && gameId)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-gray-400">Connecting to neural network...</p>
        </div>
      </div>
    )
  }

  const phase = game?.phase || "JOINING"
  const roundCondition = game?.roundCondition || "BULLISH"
  const isExpanded = phase === "JOINING" || phase === "TEAM_BETTING" || phase === "RESULTS"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-foreground selection:bg-purple-500/30">
      {/* Left Sidebar - Team Blue */}
      <div className="w-[20%] min-w-[250px] border-r border-white/10 transition-all duration-500">
        <TeamSidebar players={players} team="blue" className="h-full" expanded={isExpanded} />
      </div>

      {/* Center Stage */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="transition-opacity hover:opacity-80">
          <TopBar
            phase={phase}
            timeLeft={timeLeft} // Use calculated timeLeft
            theme={game?.theme || "Loading..."}
            roundCondition={roundCondition}
            testMode={testMode} // Pass testMode
            onToggleTestMode={setTestMode} // Pass setter
          />
        </div>
        <ChartArea gameId={game?.id} />
        <BottomPanel phase={phase} roundCondition={roundCondition} gameId={game?.id} theme={game?.theme} />
      </div>

      {/* Right Sidebar - Team Red */}
      <div className="w-[20%] min-w-[250px] border-l border-white/10 transition-all duration-500">
        <TeamSidebar players={players} team="red" className="h-full" expanded={isExpanded} />
      </div>
    </div>
  )
}
