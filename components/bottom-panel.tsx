"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Wallet, Send, AlertTriangle, Coins, Clock, Activity, Users } from "lucide-react"
import type { GamePhase, RoundCondition } from "@/lib/data"
import { useJoinGame, usePlaceBet, useSubmitPrompt } from "@/lib/supabase/hooks"

interface BottomPanelProps {
  phase: GamePhase
  roundCondition: RoundCondition
  gameId?: string
  theme?: string
}

export function BottomPanel({ phase, roundCondition, gameId, theme }: BottomPanelProps) {
  const [betAmount, setBetAmount] = useState(100)
  const [prompt, setPrompt] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<"blue" | "red">("blue")
  const [playerId, setPlayerId] = useState<string | null>(null)

  const { joinGame, loading: joinLoading } = useJoinGame()
  const { placeBet, loading: betLoading } = usePlaceBet()
  const { submitPrompt, loading: promptLoading } = useSubmitPrompt()

  const handleJoin = async () => {
    if (!gameId || !walletAddress) return
    const id = await joinGame(gameId, walletAddress, selectedTeam)
    if (id) {
      setPlayerId(id)
    }
  }

  const handleBet = async () => {
    if (!playerId) return
    await placeBet(playerId, betAmount, "team")
  }

  const handlePromptSubmit = async () => {
    if (!gameId || !playerId || !prompt) return
    const id = await submitPrompt(gameId, playerId, prompt, selectedTeam)
    if (id) {
      setPrompt("")
    }
  }

  const renderContent = () => {
    switch (phase) {
      case "JOINING":
        return (
          <div className="flex h-full items-center justify-center gap-8">
            <div className="flex flex-col gap-4 w-full max-w-md">
              <div className="flex gap-4">
                <Button
                  variant={selectedTeam === "blue" ? "default" : "outline"}
                  className={`flex-1 ${selectedTeam === "blue" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-500"}`}
                  onClick={() => setSelectedTeam("blue")}
                >
                  Team Blue
                </Button>
                <Button
                  variant={selectedTeam === "red" ? "default" : "outline"}
                  className={`flex-1 ${selectedTeam === "red" ? "bg-red-600 hover:bg-red-700" : "border-red-600 text-red-500"}`}
                  onClick={() => setSelectedTeam("red")}
                >
                  Team Red
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Wallet Address (0x...)"
                  className="bg-black/50 border-white/10 font-mono"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-700 min-w-[140px]"
                  onClick={handleJoin}
                  disabled={joinLoading || !walletAddress}
                >
                  {joinLoading ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )

      case "TEAM_BETTING":
        return (
          <div className="flex h-full gap-6">
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                <span>WAGER AMOUNT</span>
                <span>BALANCE: 1,000 PADS</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[betAmount]}
                  onValueChange={(v) => setBetAmount(v[0])}
                  max={1000}
                  step={10}
                  className="flex-1"
                />
                <div className="w-24 h-10 bg-black/50 border border-white/10 rounded flex items-center justify-center font-mono font-bold text-purple-400">
                  {betAmount}
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg font-bold tracking-wider"
                onClick={handleBet}
                disabled={betLoading || !playerId}
              >
                {betLoading ? "PLACING BET..." : "PLACE BET"}
              </Button>
            </div>
          </div>
        )

      case "PROMPTS":
        const [entity, format] = theme ? theme.split("|").map((s) => s.trim()) : ["Unknown", "Unknown"]

        return (
          <div className="flex h-full gap-4">
            <div className="w-64 bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono mb-1">PLAYERS ONLINE</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    1,337
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono mb-1">CURRENT POT</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    6,300
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono mb-1">NEXT ROUND IN</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    00:45
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono mb-1">ROUND STATUS</div>
                  <div className="text-lg font-bold text-green-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Active
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 bg-black/20 py-1 rounded border border-white/5">
                <div className="text-xs font-mono text-gray-400">
                  ROLEPLAY: <span className="text-purple-400 font-bold">{entity}</span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  FORMAT: <span className="text-blue-400 font-bold">{format}</span>
                </div>
              </div>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder={`Write a ${format} as ${entity} to influence the market...`}
                  className="h-full bg-black/50 border-white/10 font-mono resize-none focus:border-purple-500/50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  className="h-full w-32 bg-purple-600 hover:bg-purple-700 flex flex-col gap-2"
                  onClick={handlePromptSubmit}
                  disabled={promptLoading || !playerId || !prompt}
                >
                  <Send className="w-6 h-6" />
                  <span>{promptLoading ? "SENDING..." : "SUBMIT"}</span>
                </Button>
              </div>
            </div>
          </div>
        )

      case "SOLO_BETTING":
        return (
          <div className="flex h-full items-center gap-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black to-transparent z-10 flex items-center pl-8 pointer-events-none">
              <div className="animate-in slide-in-from-left duration-1000">
                <div className="text-xs font-mono text-gray-400 mb-1">ROUND CONDITION REVEALED</div>
                <div
                  className={`text-4xl font-black tracking-tighter ${
                    roundCondition === "BULLISH" ? "text-green-500" : "text-red-500"
                  } drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}
                >
                  {roundCondition === "BULLISH" ? "🐂 BULLISH ROUND" : "🐻 BEARISH ROUND"}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-20 ml-[33%]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" />
                CONFIDENCE BET
              </h3>
              <div className="flex items-center gap-4 w-full max-w-md">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={(v) => setBetAmount(v[0])}
                />
                <div className="text-2xl font-mono font-bold text-purple-400">{betAmount}%</div>
              </div>
              <Button
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-8"
                onClick={() => placeBet(playerId!, betAmount, "solo")}
                disabled={betLoading || !playerId}
              >
                LOCK IN CONFIDENCE
              </Button>
            </div>
          </div>
        )

      case "RACE":
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center animate-pulse">
              <h2 className="text-3xl font-black text-white tracking-widest mb-2">RACE IN PROGRESS</h2>
              <p className="text-purple-400 font-mono">HIGH VOLATILITY DETECTED</p>
            </div>
          </div>
        )

      case "RESULTS":
        return (
          <div className="flex h-full items-center justify-around w-full px-12">
            <div className="text-center">
              <div className="text-sm text-gray-400 font-mono mb-2">WINNING TEAM</div>
              <div className="text-4xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                TEAM BLUE
              </div>
            </div>
            <div className="h-16 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-sm text-gray-400 font-mono mb-2">YOUR PAYOUT</div>
              <div className="text-4xl font-black text-green-400 flex items-center gap-2 justify-center">
                <Coins className="w-8 h-8" />
                +2,450 PADS
              </div>
            </div>
            <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8">CLAIM REWARDS</Button>
          </div>
        )
    }
  }

  return (
    <div className="h-[25%] min-h-[200px] border-t border-white/10 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative z-10 h-full p-6">{renderContent()}</div>
    </div>
  )
}
