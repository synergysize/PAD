import type { Player } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayerCardProps {
  player: Player | null
}

export function PlayerCard({ player }: PlayerCardProps) {
  if (!player) return null

  const isEliminated = player.status === "eliminated"
  const isBlue = player.team === "blue"
  const currentBet = (Number(player.teamBet) || 0) + (Number(player.soloBet) || 0)
  const padsBalance = Number(player.padsBalance) || 0

  return (
    <Card
      className={cn(
        "mb-3 border-l-4 bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60",
        isBlue
          ? "border-l-blue-500 border-y-blue-900/30 border-r-blue-900/30"
          : "border-l-red-500 border-y-red-900/30 border-r-red-900/30",
        isEliminated && "opacity-50 grayscale",
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative h-10 w-10 overflow-hidden rounded-full border-2",
              isBlue
                ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                : "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
            )}
          >
            <img src={player.avatar || "/placeholder.svg"} alt={player.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="truncate font-bold text-white">{player.name}</h3>
              {isEliminated && (
                <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                  OUT
                </Badge>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                <span className="font-mono text-white">{padsBalance.toLocaleString()} PADS</span>
                <span className="text-[10px] text-gray-500">({player.solBalance} SOL)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded bg-black/50 px-2 py-1">
          <span className="text-xs text-gray-500">CURRENT BET</span>
          <div className={cn("flex items-center gap-1 font-mono font-bold", isBlue ? "text-blue-400" : "text-red-400")}>
            <Coins className="h-3 w-3" />
            {currentBet.toLocaleString()} PADS
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
