export const TEST_PLAYERS = [
  { nickname: "DegenDave", wallet: "8x...dave", team: "blue" },
  { nickname: "MoonBoi", wallet: "8x...moon", team: "red" },
  { nickname: "DiamondHands", wallet: "8x...hand", team: "blue" },
  { nickname: "SatoshiNakamoto", wallet: "8x...sato", team: "red" },
  { nickname: "VitalikButerin", wallet: "8x...vita", team: "blue" },
]

export const TEST_PROMPTS = [
  "When you buy the dip but it keeps dipping 📉",
  "Me explaining to my grandma why I lost her pension on dog coins 🐶",
  "POV: You sold at the bottom and now it's pumping 🤡",
  "My portfolio is 99% down but I'm still bullish 🚀",
  "Waiting for the bull run like... 💀",
  "Crypto trading is easy, I'm only 25 (looks 80) 👴",
  "Buying high and selling low is my passion 💸",
  "When the gas fee is higher than the transaction value ⛽",
  "HODLing until I can afford a Lambo or a cardboard box 📦",
  "Checking my portfolio every 5 seconds won't make it go up 📱",
]

export function generateMockCandles(count = 10, startPrice = 1000, volatility = 0.02) {
  const candles = []
  let currentPrice = startPrice

  for (let i = 0; i < count; i++) {
    const change = currentPrice * volatility * (Math.random() - 0.5)
    const open = currentPrice
    const close = currentPrice + change
    const high = Math.max(open, close) + Math.random() * Math.abs(change)
    const low = Math.min(open, close) - Math.random() * Math.abs(change)

    candles.push({ open, high, low, close })
    currentPrice = close
  }

  return candles
}

export async function runTestMode(gameId: string, phase: string, supabase: any) {
  if (!gameId || !supabase) return

  // 1. JOINING: Create fake players
  if (phase === "JOINING") {
    const { count } = await supabase.from("players").select("*", { count: "exact", head: true }).eq("game_id", gameId)

    if (count !== null && count < 5) {
      console.log("[Test Mode] Creating fake players...")
      for (const player of TEST_PLAYERS) {
        await supabase.from("players").insert({
          game_id: gameId,
          wallet_address: player.wallet,
          nickname: player.nickname,
          team: player.team,
          pads_balance: Math.floor(Math.random() * 5000) + 500,
          sol_balance: (Math.random() * 2).toFixed(2),
          status: "active",
        })
      }
    }
  }

  // 2. TEAM_BETTING: Place random bets
  if (phase === "TEAM_BETTING") {
    const { data: players } = await supabase.from("players").select("id, team_bet").eq("game_id", gameId)

    if (players) {
      for (const player of players) {
        if (!player.team_bet) {
          await supabase
            .from("players")
            .update({ team_bet: Math.floor(Math.random() * 500) + 10 })
            .eq("id", player.id)
        }
      }
    }
  }

  // 3. PROMPTS: Submit fake prompts with mock candles
  if (phase === "PROMPTS") {
    const { data: players } = await supabase.from("players").select("id, team").eq("game_id", gameId)
    const { data: existingPrompts } = await supabase.from("prompts").select("player_id").eq("game_id", gameId)

    const existingPlayerIds = new Set(existingPrompts?.map((p) => p.player_id) || [])

    if (players) {
      for (const player of players) {
        if (!existingPlayerIds.has(player.id)) {
          const promptText = TEST_PROMPTS[Math.floor(Math.random() * TEST_PROMPTS.length)]
          const candles = generateMockCandles(10, 1000, 0.05) // High volatility for fun

          await supabase.from("prompts").insert({
            game_id: gameId,
            player_id: player.id,
            text: promptText,
            team: player.team,
            status: "completed", // Skip Claude API
            candles: candles,
            submitted_at: new Date().toISOString(),
          })
        }
      }
    }
  }

  // 4. SOLO_BETTING: Place random solo bets
  if (phase === "SOLO_BETTING") {
    const { data: players } = await supabase.from("players").select("id, solo_bet").eq("game_id", gameId)

    if (players) {
      for (const player of players) {
        if (!player.solo_bet) {
          await supabase
            .from("players")
            .update({ solo_bet: Math.floor(Math.random() * 500) + 10 })
            .eq("id", player.id)
        }
      }
    }
  }
}
