import type { GamePhase } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap } from "lucide-react"

interface TopBarProps {
  phase: GamePhase
  timeLeft: number
  theme: string
}

export function TopBar({ phase, timeLeft, theme }: TopBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <span className="font-mono text-xs text-green-500">LIVE FEED</span>
        </div>
        <div className="h-8 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">CURRENT THEME:</span>
          <span className="font-bold text-white shadow-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{theme}</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center">
        <Badge variant="outline" className="mb-1 border-purple-500/50 bg-purple-950/20 text-[10px] text-purple-400">
          PHASE{" "}
          {phase === "JOINING"
            ? "1"
            : phase === "BETTING"
              ? "2"
              : phase === "PROMPTS"
                ? "3"
                : phase === "SIDE_BETS"
                  ? "4"
                  : phase === "RACE"
                    ? "5"
                    : "6"}
        </Badge>
        <h1 className="text-2xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {phase.replace("_", " ")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="font-mono text-xl font-bold text-yellow-500">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
          <Zap className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}
