import { MOCK_PROMPTS } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Terminal, Activity } from "lucide-react"

interface LiveFeedProps {
  className?: string
  team?: "blue" | "red"
}

export function LiveFeed({ className, team }: LiveFeedProps) {
  const filteredPrompts = team ? MOCK_PROMPTS.filter((p) => p.team === team) : MOCK_PROMPTS

  const isBlue = team === "blue"
  const accentColor = isBlue ? "text-blue-500" : team === "red" ? "text-red-500" : "text-green-500"

  return (
    <div className={cn("flex h-full flex-col bg-[#0a0a0a]", className)}>
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Terminal className={cn("h-4 w-4", accentColor)} />
          <h3 className={cn("font-mono text-xs font-bold tracking-widest", accentColor)}>
            {team ? `TEAM ${team.toUpperCase()} FEED` : "LIVE PROMPTS"}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                isBlue ? "bg-blue-400" : team === "red" ? "bg-red-400" : "bg-green-400",
              )}
            ></span>
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isBlue ? "bg-blue-500" : team === "red" ? "bg-red-500" : "bg-green-500",
              )}
            ></span>
          </span>
          <span className={cn("text-[10px] font-bold", accentColor)}>ONLINE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <div className="space-y-2">
          {filteredPrompts.map((prompt) => {
            const isProcessing = prompt.status === "processing"

            return (
              <div
                key={prompt.id}
                className={cn(
                  "group relative overflow-hidden rounded border bg-black/20 p-3 transition-all hover:bg-black/40",
                  isProcessing
                    ? isBlue
                      ? "border-blue-500/50 bg-blue-500/5"
                      : team === "red"
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-green-500/50 bg-green-500/5"
                    : "border-white/5",
                )}
              >
                {isProcessing && (
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-20",
                      isBlue ? "via-blue-500/5" : team === "red" ? "via-red-500/5" : "via-green-500/5",
                    )}
                  />
                )}

                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-4 border-0 px-1.5 text-[10px] font-bold uppercase tracking-wider",
                        isBlue
                          ? "bg-blue-500/20 text-blue-400"
                          : team === "red"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-purple-500/20 text-purple-400",
                      )}
                    >
                      {prompt.author}
                    </Badge>
                    <span className="text-[10px] text-gray-500">
                      {new Date(prompt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {isProcessing && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-4 px-1.5 text-[9px]",
                        isBlue
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          : team === "red"
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-green-500/30 bg-green-500/10 text-green-400",
                      )}
                    >
                      <Activity className="mr-1 h-3 w-3 animate-pulse" />
                      PROCESSING
                    </Badge>
                  )}
                </div>

                <p className={cn("font-mono text-xs leading-relaxed", isProcessing ? "text-white" : "text-gray-400")}>
                  {prompt.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
