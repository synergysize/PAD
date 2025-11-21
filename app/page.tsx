"use client"

import { useState } from "react"
import { MOCK_PLAYERS, type GamePhase } from "@/lib/data"
import { TeamSidebar } from "@/components/team-sidebar"
import { TopBar } from "@/components/top-bar"
import { BottomPanel } from "@/components/bottom-panel"
import { ChartArea } from "@/components/chart-area"
import { LiveFeed } from "@/components/live-feed"

export default function Page() {
  const [phase, setPhase] = useState<GamePhase>("JOINING")

  const blueTeam = MOCK_PLAYERS.filter((p) => p.team === "blue")
  const redTeam = MOCK_PLAYERS.filter((p) => p.team === "red")

  const cyclePhase = () => {
    setPhase((current) => {
      if (current === "JOINING") return "BETTING"
      if (current === "BETTING") return "PROMPTS"
      if (current === "PROMPTS") return "SIDE_BETS"
      if (current === "SIDE_BETS") return "RACE"
      if (current === "RACE") return "RESULTS"
      return "JOINING"
    })
  }

  const isExpanded = phase === "JOINING" || phase === "BETTING" || phase === "RESULTS"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-foreground selection:bg-blue-500/30">
      {/* Left Sidebar - Blue Team */}
      <div className="w-[20%] min-w-[250px] border-r border-white/10 transition-all duration-500">
        <TeamSidebar team="blue" players={blueTeam} className="h-full" expanded={isExpanded} />
      </div>

      {/* Center Stage */}
      <div className="flex flex-1 flex-col min-w-0">
        <div
          onClick={cyclePhase}
          className="cursor-pointer transition-opacity hover:opacity-80"
          title="Click to cycle game phase"
        >
          <TopBar phase={phase} timeLeft={145} theme="CYBERPUNK DYSTOPIA" />
        </div>
        <ChartArea />
        <BottomPanel phase={phase} />
      </div>

      {/* Right Sidebar - Red Team */}
      <div className="w-[20%] min-w-[250px] border-l border-white/10 transition-all duration-500">
        <TeamSidebar team="red" players={redTeam} className="h-full" expanded={isExpanded} />
      </div>

      {!isExpanded && (
        <div className="absolute bottom-48 left-[20%] right-[20%] top-16 -z-10 bg-black/50 backdrop-blur-sm">
          <LiveFeed />
        </div>
      )}
    </div>
  )
}
