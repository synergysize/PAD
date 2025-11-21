import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const SUPABASE_URL = "https://zdxkmfujsrriwrlbembt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGttZnVqc3JyaXdybGJlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTA3NDcsImV4cCI6MjA3OTIyNjc0N30.gXmtd8fjK0YDflaHFA-wUXxNIoOJ6guqpbN68zHeVus";

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    //  Updated to use player_id and game_id
    const { player_id, game_id, text } = await request.json()

    if (!player_id || !game_id || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    //  Get player's team from players table
    const { data: player } = await supabase.from("players").select("team").eq("id", player_id).single()

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    //  Check if player already submitted a prompt for this game
    const { data: existingPrompt } = await supabase
      .from("prompts")
      .select("id")
      .eq("player_id", player_id)
      .eq("game_id", game_id)
      .single()

    if (existingPrompt) {
      return NextResponse.json({ error: "Prompt already submitted" }, { status: 400 })
    }

    //  Insert prompt with game_id and player_id
    const { data: prompt, error } = await supabase
      .from("prompts")
      .insert({
        game_id,
        player_id,
        text,
        team: player.team,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, prompt })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
