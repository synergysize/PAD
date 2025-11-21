import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const SUPABASE_URL = "https://zdxkmfujsrriwrlbembt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGttZnVqc3JyaXdybGJlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTA3NDcsImV4cCI6MjA3OTIyNjc0N30.gXmtd8fjK0YDflaHFA-wUXxNIoOJ6guqpbN68zHeVus";

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    //  Updated to use wallet_address and game_id
    const { wallet_address, nickname, game_id } = await request.json()

    if (!wallet_address || !game_id) {
      return NextResponse.json({ error: "Wallet address and game ID required" }, { status: 400 })
    }

    //  Get current game from games table
    const { data: game } = await supabase.from("games").select("*").eq("id", game_id).single()

    if (!game || game.phase !== "JOINING") {
      return NextResponse.json({ error: "Game not accepting players" }, { status: 400 })
    }

    //  Count players per team for this specific game
    const { data: players } = await supabase.from("players").select("team").eq("game_id", game_id)

    const blueCount = players?.filter((p) => p.team === "blue").length || 0
    const redCount = players?.filter((p) => p.team === "red").length || 0
    const team = blueCount <= redCount ? "blue" : "red"

    //  Create player in players table
    const { data: newPlayer, error } = await supabase
      .from("players")
      .insert({
        game_id,
        wallet_address,
        nickname: nickname || wallet_address.slice(0, 8),
        team,
        pads_balance: 1000,
        sol_balance: 0.1,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, player: newPlayer })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
