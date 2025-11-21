import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    // 1. Fetch pending prompts
    const { data: prompts, error: fetchError } = await supabaseClient
      .from("prompts")
      .select("*, players(wallet_address)")
      .eq("status", "pending")
      .limit(5)

    if (fetchError) throw fetchError
    if (!prompts || prompts.length === 0) {
      return new Response(JSON.stringify({ message: "No pending prompts" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const results = []

    // 2. Process each prompt
    for (const prompt of prompts) {
      // Update status to processing
      await supabaseClient.from("prompts").update({ status: "processing" }).eq("id", prompt.id)

      try {
        // Call Claude API
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content: `Generate exactly 10 OHLCV candlesticks for this trading scenario: "${prompt.text}"

Rules:
- Start from $1000 base price
- Each candle = 1 minute interval
- Include realistic volatility (5-15% moves)
- Bullish prompts trend up, bearish prompts trend down
- Output only JSON array:
[{"time":0,"open":1000,"high":1050,"low":995,"close":1020}, ...]`,
              },
            ],
          }),
        })

        const data = await response.json()
        const content = data.content[0].text

        // Extract JSON from response (in case of extra text)
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (!jsonMatch) throw new Error("No JSON found in response")

        const candles = JSON.parse(jsonMatch[0])

        // Update prompt with candles and completed status
        const { error: updateError } = await supabaseClient
          .from("prompts")
          .update({
            status: "completed",
            candles: candles,
            submitted_at: new Date().toISOString(), // Update timestamp to now for ordering
          })
          .eq("id", prompt.id)

        if (updateError) throw updateError
        results.push({ id: prompt.id, status: "success" })
      } catch (error) {
        console.error(`Error processing prompt ${prompt.id}:`, error)
        // Revert to pending or set to failed
        await supabaseClient
          .from("prompts")
          .update({ status: "failed" }) // You might want to add 'failed' to the check constraint if not present, or just leave as processing/pending
          .eq("id", prompt.id)
        results.push({ id: prompt.id, status: "error", error: error.message })
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
