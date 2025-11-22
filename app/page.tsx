"use client"

import { useState, useEffect } from "react"
import { TeamSidebar } from "@/components/team-sidebar"
import { TopBar } from "@/components/top-bar"
import { BottomPanel } from "@/components/bottom-panel"
import { ChartArea } from "@/components/chart-area"
import { useGame, usePlayer } from "@/lib/supabase/hooks"
import type { Player } from "@/lib/data"

const ACTIVE_GAME_ID = "550e8400-e29b-41d4-a716-446655440000"

const mockPlayers: Player[] = [
  {
    id: "1",
    gameId: ACTIVE_GAME_ID,
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
    gameId: ACTIVE_GAME_ID,
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
    gameId: ACTIVE_GAME_ID,
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
    gameId: ACTIVE_GAME_ID,
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
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const { game } = useGame(ACTIVE_GAME_ID)
  const { player } = usePlayer(ACTIVE_GAME_ID, walletAddress)

  const phase = game?.phase || "JOINING"
  const roundCondition = game?.roundCondition || "BULLISH"
  const theme = game?.theme || "What would you do if you won $1M?"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isExpanded = phase === "JOINING" || phase === "TEAM_BETTING" || phase === "RESULTS"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-foreground selection:bg-purple-500/30">
      <div className="w-[20%] min-w-[250px] border-r border-white/10 transition-all duration-500">
        <TeamSidebar players={mockPlayers} team="blue" className="h-full" expanded={isExpanded} />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="transition-opacity hover:opacity-80">
          <TopBar phase={phase} timeLeft={145} theme={theme} roundCondition={roundCondition} />
        </div>
        <ChartArea gameId={ACTIVE_GAME_ID} phase={phase} />
        <BottomPanel
          phase={phase}
          roundCondition={roundCondition}
          gameId={ACTIVE_GAME_ID}
          theme={theme}
          player={player}
          onJoin={(address) => setWalletAddress(address)}
        />
      </div>

      <div className="w-[20%] min-w-[250px] border-l border-white/10 transition-all duration-500">
        <TeamSidebar players={mockPlayers} team="red" className="h-full" expanded={isExpanded} />
      </div>
    </div>
  )
}
