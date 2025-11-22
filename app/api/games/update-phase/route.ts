import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { gameId, phase } = await request.json()

  if (!gameId || !phase) {
    return NextResponse.json({ error: "Missing gameId or phase" }, { status: 400 })
  }

  try {
    const updates: any = {
      phase,
      updated_at: new Date().toISOString(),
    }

    // If transitioning to RACE, set the end time
    if (phase === "RACE") {
      const endsAt = new Date()
      endsAt.setSeconds(endsAt.getSeconds() + 15) // 15 seconds race
      updates.phase_ends_at = endsAt.toISOString()
    }

    const { data, error } = await supabase.from("games").update(updates).eq("id", gameId).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, game: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
