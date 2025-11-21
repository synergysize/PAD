import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST() {
  try {
    // Initialize Supabase client with Service Role Key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

    if (!supabase) {
      console.warn("[process-prompts] Missing Supabase credentials")
      return NextResponse.json({ message: "Supabase not configured" }, { status: 200 })
    }

    // 1. Fetch pending prompts
    const { data: prompts, error: fetchError } = await supabase
      .from("prompts")
      .select("*, players(wallet_address)")
      .eq("status", "pending")
      .limit(5)

    if (fetchError) throw fetchError
    if (!prompts || prompts.length === 0) {
      return NextResponse.json({ message: "No pending prompts" })
    }

    const results = []

    // 2. Process each prompt
    for (const prompt of prompts) {
      // Update status to processing
      await supabase.from("prompts").update({ status: "processing" }).eq("id", prompt.id)

      try {
        let candles

        // Check for API key
        if (process.env.ANTHROPIC_API_KEY) {
          // Call Claude via AI SDK
          const { text } = await generateText({
            model: anthropic("claude-3-haiku-20240307"),
            prompt: `Generate exactly 10 OHLCV candlesticks for this trading scenario: "${prompt.text}"

Rules:
- Start from $1000 base price
- Each candle = 1 minute interval
- Include realistic volatility (5-15% moves)
- Bullish prompts trend up, bearish prompts trend down
- Output only JSON array:
[{"time":0,"open":1000,"high":1050,"low":995,"close":1020}, ...]`,
          })

          // Extract JSON
          const jsonMatch = text.match(/\[[\s\S]*\]/)
          if (!jsonMatch) throw new Error("No JSON found in response")
          candles = JSON.parse(jsonMatch[0])
        } else {
          // Fallback: Generate mock data if no API key
          console.log("[v0] No ANTHROPIC_API_KEY, generating mock data")
          candles = Array.from({ length: 10 }, (_, i) => {
            const base = 1000 + (Math.random() - 0.5) * 100
            return {
              time: i,
              open: base,
              high: base + 10,
              low: base - 10,
              close: base + (Math.random() - 0.5) * 20,
            }
          })
        }

        // Update prompt with candles and completed status
        const { error: updateError } = await supabase
          .from("prompts")
          .update({
            status: "completed",
            candles: candles,
            submitted_at: new Date().toISOString(),
          })
          .eq("id", prompt.id)

        if (updateError) throw updateError
        results.push({ id: prompt.id, status: "success" })
      } catch (error) {
        console.error(`Error processing prompt ${prompt.id}:`, error)
        await supabase.from("prompts").update({ status: "failed" }).eq("id", prompt.id)
        results.push({ id: prompt.id, status: "error", error: error.message })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error in process-prompts:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
