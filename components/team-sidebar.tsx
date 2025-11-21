import type { Player } from "@/lib/data"
import { PlayerCard } from "@/components/player-card"
import { LiveFeed } from "@/components/live-feed"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"

interface TeamSidebarProps {
  team: "blue" | "red"
  players: Player[]
  className?: string
  expanded?: boolean // Added expanded prop to control state
}

export function TeamSidebar({ team, players, className, expanded = true }: TeamSidebarProps) {
  const isBlue = team === "blue"
  const teamName = isBlue ? "TEAM BLUE" : "TEAM RED"
  const teamColor = isBlue ? "text-blue-500" : "text-red-500"
  const borderColor = isBlue ? "border-blue-500/20" : "border-red-500/20"
  const glowColor = isBlue ? "shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "shadow-[0_0_20px_rgba(239,68,68,0.1)]"

  const totalBet = players.reduce((acc, p) => acc + p.bet, 0)

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-[#0a0a0a] transition-all duration-500",
        borderColor,
        glowColor,
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
          expanded ? "h-full" : "h-[30%]",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4 pb-4">
          <div className="flex items-center gap-2">
            <Users className={cn("h-5 w-5", teamColor)} />
            <h2 className={cn("text-xl font-black tracking-wider", teamColor)}>{teamName}</h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">TOTAL POOL</div>
            <div className="font-mono text-sm font-bold text-white">{totalBet.toFixed(1)} ETH</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        <div
          className={cn(
            "mx-4 mb-4 mt-auto shrink-0 rounded-lg border border-dashed p-3 text-center text-xs uppercase tracking-widest opacity-50",
            isBlue ? "border-blue-500/30 text-blue-500" : "border-red-500/30 text-red-500",
          )}
        >
          {players.filter((p) => p.status === "active").length} / {players.length} ALIVE
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 transition-all duration-500 ease-in-out",
          expanded ? "h-0 opacity-0" : "h-[70%] opacity-100",
        )}
      >
        <LiveFeed />
      </div>
    </div>
  )
}
