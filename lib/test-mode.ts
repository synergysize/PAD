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

export function generateMockCandles(count = 10, startPrice = 1000, volatility = 0.02, seed = 0) {
  const candles = []
  let currentPrice = startPrice

  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  for (let i = 0; i < count; i++) {
    const randomValue = seededRandom(seed + i)
    const change = currentPrice * volatility * (randomValue - 0.5)
    const open = currentPrice
    const close = currentPrice + change
    const high = Math.max(open, close) + seededRandom(seed + i + 100) * Math.abs(change)
    const low = Math.min(open, close) - seededRandom(seed + i + 200) * Math.abs(change)

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
      console.log("[v0] Test Mode: Creating fake players...")
      for (let i = 0; i < TEST_PLAYERS.length; i++) {
        const player = TEST_PLAYERS[i]
        const padsBalance = 500 + i * 1000
        const solBalance = (0.1 + i * 0.3).toFixed(2)

        await supabase.from("players").insert({
          game_id: gameId,
          wallet_address: player.wallet,
          nickname: player.nickname,
          team: player.team,
          pads_balance: padsBalance,
          sol_balance: solBalance,
          status: "active",
        })
      }
    }
  }

  // 2. TEAM_BETTING: Place random bets
  if (phase === "TEAM_BETTING") {
    const { data: players } = await supabase.from("players").select("id, team_bet").eq("game_id", gameId)

    if (players) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        if (!player.team_bet || player.team_bet === 0) {
          const betAmount = 100 + i * 50
          await supabase.from("players").update({ team_bet: betAmount }).eq("id", player.id)
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
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        if (!existingPlayerIds.has(player.id)) {
          const promptText = TEST_PROMPTS[i % TEST_PROMPTS.length]
          const candles = generateMockCandles(10, 1000, 0.05, i)

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
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        if (!player.solo_bet || player.solo_bet === 0) {
          const betAmount = 50 + i * 75
          await supabase.from("players").update({ solo_bet: betAmount }).eq("id", player.id)
        }
      }
    }
  }
}
