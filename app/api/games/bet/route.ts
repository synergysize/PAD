import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const SUPABASE_URL = "https://zdxkmfujsrriwrlbembt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGttZnVqc3JyaXdybGJlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTA3NDcsImV4cCI6MjA3OTIyNjc0N30.gXmtd8fjK0YDflaHFA-wUXxNIoOJ6guqpbN68zHeVus";

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    //  Updated to use player_id and game_id
    const { player_id, game_id, amount, bet_type } = await request.json()

    if (!player_id || !game_id || !amount || !bet_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    //  Get player's current balance from players table
    const { data: player } = await supabase.from("players").select("pads_balance, team_bet, solo_bet").eq("id", player_id).single()

    if (!player || player.pads_balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    //  Update player's balance and bet amount
    const updateData: any = { pads_balance: player.pads_balance - amount }
    if (bet_type === "team") {
      updateData.team_bet = player.team_bet + amount
    } else if (bet_type === "solo") {
      updateData.solo_bet = player.solo_bet + amount
    }

    const { error: updateError } = await supabase.from("players").update(updateData).eq("id", player_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    //  Update game pot in games table
    const { data: game } = await supabase.from("games").select("total_pot").eq("id", game_id).single()

    if (game) {
      await supabase
        .from("games")
        .update({ total_pot: game.total_pot + amount })
        .eq("id", game_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
