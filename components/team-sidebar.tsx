import { cn } from "@/lib/utils"
import { PlayerCard } from "./player-card"
import { LiveFeed } from "./live-feed"
import type { Player } from "@/lib/data"
import { Users, Trophy, Zap } from "lucide-react"

interface TeamSidebarProps {
  players: Player[]
  team: "blue" | "red"
  className?: string
  expanded?: boolean
}

export function TeamSidebar({ players, team, className, expanded = true }: TeamSidebarProps) {
  const teamPlayers = players.filter((p) => p.team === team)
  const totalPads = teamPlayers.reduce((acc, p) => acc + p.padsBalance, 0)
  const activePlayers = teamPlayers.filter((p) => p.status === "active").length

  const teamColor = team === "blue" ? "text-blue-500" : "text-red-500"
  const borderColor = team === "blue" ? "border-blue-500/20" : "border-red-500/20"
  const bgGradient =
    team === "blue"
      ? "bg-gradient-to-b from-blue-950/20 to-transparent"
      : "bg-gradient-to-b from-red-950/20 to-transparent"

  return (
    <div className={cn("flex flex-col bg-[#0a0a0a] relative overflow-hidden", className)}>
      {/* Background Effects */}
      <div className={cn("absolute inset-0 pointer-events-none", bgGradient)} />

      {/* Header */}
      <div className={cn("p-4 border-b border-white/10 relative z-10", borderColor)}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={cn("text-xl font-bold tracking-wider flex items-center gap-2", teamColor)}>
            {team === "blue" ? "TEAM BLUE" : "TEAM RED"}
            <Trophy className="w-4 h-4 opacity-50" />
          </h2>
          <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
            <Users className="w-3 h-3" />
            <span>
              {activePlayers}/{teamPlayers.length}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-500">TOTAL POWER</span>
          <span className="text-white font-bold">{totalPads.toLocaleString()} PADS</span>
        </div>
      </div>

      {/* Content Area - Sliding Panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Player List - Slides Up/Down */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 transition-all duration-500 ease-in-out overflow-y-auto scrollbar-hide",
            expanded ? "h-full opacity-100" : "h-[30%] opacity-80 border-b border-white/10",
          )}
        >
          <div className="p-4 space-y-3">
            {teamPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} compact={!expanded} />
            ))}
            {teamPlayers.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-sm font-mono">Waiting for players...</div>
            )}
          </div>
        </div>

        {/* Live Feed - Slides In from Bottom */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-[#0a0a0a] transition-all duration-500 ease-in-out border-t border-white/10",
            expanded ? "h-0 opacity-0 translate-y-full" : "h-[70%] opacity-100 translate-y-0",
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-mono font-bold text-gray-400">LIVE FEED</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <LiveFeed team={team} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
