"use client"

import { useState, useEffect } from "react"
import { TeamSidebar } from "@/components/team-sidebar"
import { TopBar } from "@/components/top-bar"
import { BottomPanel } from "@/components/bottom-panel"
import { ChartArea } from "@/components/chart-area"
import type { Player } from "@/lib/data"

const mockPlayers: Player[] = [
  {
    id: "1",
    gameId: "mock-game",
    walletAddress: "0x1234...5678",
    nickname: "CryptoKing",
    team: "blue",
    padsBalance: 1250,
    solBalance: 0.5,
    teamBet: 100,
    soloBet: 50,
    status: "active",
    avatar: "/cyberpunk-avatar-blue.png",
  },
  {
    id: "2",
    gameId: "mock-game",
    walletAddress: "0x8765...4321",
    nickname: "MoonBoi",
    team: "blue",
    padsBalance: 980,
    solBalance: 0.3,
    teamBet: 150,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-blue-2.jpg",
  },
  {
    id: "3",
    gameId: "mock-game",
    walletAddress: "0xabcd...efgh",
    nickname: "DiamondHands",
    team: "red",
    padsBalance: 1500,
    solBalance: 0.8,
    teamBet: 200,
    soloBet: 100,
    status: "active",
    avatar: "/cyberpunk-avatar-red.jpg",
  },
  {
    id: "4",
    gameId: "mock-game",
    walletAddress: "0xijkl...mnop",
    nickname: "DegenDave",
    team: "red",
    padsBalance: 750,
    solBalance: 0.2,
    teamBet: 50,
    soloBet: 25,
    status: "active",
    avatar: "/cyberpunk-avatar-red-2.jpg",
  },
]

export default function Page() {
  const [isMounted, setIsMounted] = useState(false)
  const [phase, setPhase] = useState<string>("JOINING")
  const [roundCondition, setRoundCondition] = useState<string>("BULLISH")
  const [theme, setTheme] = useState("What would you do if you won $1M?")

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isExpanded = phase === "JOINING" || phase === "TEAM_BETTING" || phase === "RESULTS"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-foreground selection:bg-purple-500/30">
      {/* Left Sidebar - Team Blue */}
      <div className="w-[20%] min-w-[250px] border-r border-white/10 transition-all duration-500">
        <TeamSidebar players={mockPlayers} team="blue" className="h-full" expanded={isExpanded} />
      </div>

      {/* Center Stage */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="transition-opacity hover:opacity-80">
          <TopBar phase={phase} timeLeft={145} theme={theme} roundCondition={roundCondition} />
        </div>
        <ChartArea gameId="mock-game" />
        <BottomPanel phase={phase} roundCondition={roundCondition} gameId="mock-game" theme={theme} />
      </div>

      {/* Right Sidebar - Team Red */}
      <div className="w-[20%] min-w-[250px] border-l border-white/10 transition-all duration-500">
        <TeamSidebar players={mockPlayers} team="red" className="h-full" expanded={isExpanded} />
      </div>
    </div>
  )
}
