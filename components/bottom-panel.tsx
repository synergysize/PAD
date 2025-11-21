import type { GamePhase } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, TrendingUp, TrendingDown, MessageSquare, Zap, Trophy, Coins, Users, Play } from "lucide-react"

interface BottomPanelProps {
  phase: GamePhase
}

export function BottomPanel({ phase }: BottomPanelProps) {
  return (
    <div className="h-48 border-t border-white/10 bg-[#0a0a0a] p-6">
      <div className="flex h-full gap-6">
        {/* Main Input Area */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              {phase === "JOINING" && (
                <>
                  <Users className="h-4 w-4 text-blue-400" /> LOBBY
                </>
              )}
              {phase === "BETTING" && (
                <>
                  <Coins className="h-4 w-4 text-yellow-500" /> BETTING CONSOLE
                </>
              )}
              {phase === "PROMPTS" && (
                <>
                  <MessageSquare className="h-4 w-4 text-blue-400" /> PROMPT TERMINAL
                </>
              )}
              {phase === "SIDE_BETS" && (
                <>
                  <Zap className="h-4 w-4 text-purple-500" /> SIDE BET CHALLENGE
                </>
              )}
              {phase === "RACE" && (
                <>
                  <Play className="h-4 w-4 text-red-500" /> LIVE RACE
                </>
              )}
              {phase === "RESULTS" && (
                <>
                  <Trophy className="h-4 w-4 text-green-500" /> ROUND RESULTS
                </>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-white/10 bg-transparent text-xs hover:bg-white/5"
              >
                History
              </Button>
            </div>
          </div>

          <div className="relative flex-1">
            {phase === "JOINING" && (
              <div className="flex h-full items-center justify-center gap-6 rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white">READY TO DEGEN?</h4>
                  <p className="text-sm text-gray-400">Connect your wallet to join Team Blue or Team Red</p>
                </div>
                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  CONNECT WALLET
                </Button>
              </div>
            )}

            {phase === "BETTING" && (
              <div className="flex h-full flex-col justify-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-gray-500">WAGER AMOUNT (ETH)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-12 border-white/10 bg-black/50 font-mono text-2xl text-white placeholder:text-gray-700"
                    />
                  </div>
                  <Button className="h-12 w-32 bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                    PLACE BET
                  </Button>
                </div>
              </div>
            )}

            {phase === "PROMPTS" && (
              <>
                <textarea
                  className="h-full w-full resize-none rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Enter your battle prompt to influence the chart..."
                />
                <Button className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-blue-600 p-0 hover:bg-blue-500">
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </>
            )}

            {phase === "SIDE_BETS" && (
              <div className="flex h-full items-center justify-between rounded-lg border border-purple-500/20 bg-purple-950/10 p-6">
                <div>
                  <h4 className="text-lg font-bold text-white">CHALLENGE: BLUE FLIPPENING</h4>
                  <p className="text-sm text-gray-400">Will Team Blue overtake Team Red in the next 60s?</p>
                </div>
                <div className="flex gap-4">
                  <Button className="h-12 w-24 border border-green-500/50 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    YES (2.5x)
                  </Button>
                  <Button className="h-12 w-24 border border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                    NO (1.8x)
                  </Button>
                </div>
              </div>
            )}

            {phase === "RACE" && (
              <div className="flex h-full items-center justify-center rounded-lg border border-red-500/20 bg-red-950/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-3 w-3">
                    <div className="absolute h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></div>
                    <div className="relative h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                  <div className="text-xl font-bold text-white tracking-widest">RACE IN PROGRESS</div>
                  <div className="relative h-3 w-3">
                    <div className="absolute h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></div>
                    <div className="relative h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                </div>
              </div>
            )}

            {phase === "RESULTS" && (
              <div className="flex h-full items-center justify-center gap-8 rounded-lg border border-green-500/20 bg-green-950/10 p-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">WINNER</div>
                  <div className="text-3xl font-bold text-blue-500 glow-text-blue">TEAM BLUE</div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">TOTAL PAYOUT</div>
                  <div className="font-mono text-2xl text-white">142.5 ETH</div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">MVP</div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-700" />
                    <span className="font-bold text-white">CryptoKing</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Actions - Dynamic based on phase */}
        <div className="flex w-1/3 flex-col gap-4">
          <h3 className="text-sm font-bold text-white">
            {phase === "BETTING" ? "QUICK ACTIONS" : phase === "JOINING" ? "INFO PANEL" : "INFO PANEL"}
          </h3>

          {phase === "JOINING" && (
            <div className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-bold text-gray-500">PLAYERS ONLINE</div>
              <div className="text-2xl font-bold text-white">1,337</div>
              <div className="mt-2 text-xs font-bold text-gray-500">NEXT ROUND IN</div>
              <div className="font-mono text-xl text-yellow-500">00:45</div>
            </div>
          )}

          {phase === "BETTING" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-3 transition-colors hover:bg-green-950/20 cursor-pointer">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-green-400">LONG</span>
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  </div>
                  <div className="font-mono text-lg font-bold text-white">2.5x</div>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3 transition-colors hover:bg-red-950/20 cursor-pointer">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-red-400">SHORT</span>
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  </div>
                  <div className="font-mono text-lg font-bold text-white">5.0x</div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500">WALLET BALANCE</div>
                  <div className="font-mono text-xl font-bold text-white">42.0 ETH</div>
                </div>
              </div>
            </>
          )}

          {phase === "PROMPTS" && (
            <div className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-bold text-gray-500">CURRENT THEME</div>
              <div className="text-lg font-bold text-white">CYBERPUNK DYSTOPIA</div>
              <div className="mt-2 text-xs font-bold text-gray-500">BANNED WORDS</div>
              <div className="flex flex-wrap gap-1">
                <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">NFT</span>
                <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">WAGMI</span>
              </div>
            </div>
          )}

          {phase === "SIDE_BETS" && (
            <div className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-bold text-gray-500">YOUR ACTIVE BETS</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Blue &gt; Red</span>
                  <span className="font-mono text-green-400">+0.5 ETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Volatility &gt; 50</span>
                  <span className="font-mono text-gray-500">PENDING</span>
                </div>
              </div>
            </div>
          )}

          {phase === "RACE" && (
            <div className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-bold text-gray-500">MARKET VOLATILITY</div>
              <div className="text-2xl font-bold text-red-500 animate-pulse">HIGH</div>
              <div className="mt-2 text-xs font-bold text-gray-500">VOLUME</div>
              <div className="font-mono text-xl text-white">$42.0M</div>
            </div>
          )}

          {phase === "RESULTS" && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-950/10 p-3">
              <div className="text-xs font-bold text-yellow-500">YOUR WINNINGS</div>
              <div className="font-mono text-3xl font-bold text-white">+2.4 ETH</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
