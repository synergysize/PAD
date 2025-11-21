import { Badge } from "@/components/ui/badge"
import { Clock, Zap, HelpCircle, TrendingUp, TrendingDown } from "lucide-react"
import type { GamePhase, RoundCondition } from "@/lib/data"

interface TopBarProps {
  phase: GamePhase
  timeLeft: number
  theme: string
  roundCondition: RoundCondition
}

export function TopBar({ phase, timeLeft, theme, roundCondition }: TopBarProps) {
  const getPhaseLabel = (p: GamePhase) => {
    switch (p) {
      case "JOINING":
        return "PHASE 1: JOINING"
      case "TEAM_BETTING":
        return "PHASE 2: TEAM BETTING"
      case "PROMPTS":
        return "PHASE 3: PROMPT TERMINAL"
      case "SOLO_BETTING":
        return "PHASE 4: SOLO BETTING"
      case "RACE":
        return "PHASE 5: CHART RACE"
      case "RESULTS":
        return "PHASE 6: RESULTS"
      default:
        return "UNKNOWN PHASE"
    }
  }

  // Logic to hide/show condition
  const isConditionHidden = phase === "JOINING" || phase === "TEAM_BETTING" || phase === "PROMPTS"

  return (
    <div className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 relative z-20">
      {/* Left: Phase Indicator */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50 px-3 py-1 font-mono">
          {getPhaseLabel(phase)}
        </Badge>
        <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
          <Clock className="w-4 h-4" />
          <span>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Center: Theme */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">CURRENT THEME</div>
        <div className="text-white font-bold tracking-wide flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          {theme}
        </div>
      </div>

      {/* Right: Round Condition */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">ROUND CONDITION</div>
          {isConditionHidden ? (
            <div className="flex items-center justify-end gap-2 text-gray-400 animate-pulse">
              <HelpCircle className="w-4 h-4" />
              <span className="font-bold">HIDDEN</span>
            </div>
          ) : (
            <div
              className={`flex items-center justify-end gap-2 font-bold ${
                roundCondition === "BULLISH" ? "text-green-500" : "text-red-500"
              }`}
            >
              {roundCondition === "BULLISH" ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  BULLISH
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  BEARISH
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
