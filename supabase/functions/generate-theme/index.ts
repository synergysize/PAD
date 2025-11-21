import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declaring Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")
    if (!ANTHROPIC_API_KEY) {
      // Fallback for development if key is missing, to prevent breaking the app
      console.warn("ANTHROPIC_API_KEY is not set, using fallback theme")
      return new Response(JSON.stringify({ theme: "Murad | Twitter Thread (10/10)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: `You are a creative engine for a crypto content game. Your job is to generate a realistic and funny "Entity | Format" pair for players to roleplay.
            
            The ENTITY must be one of these specific crypto influencers:
            - Ansem
            - LexaproTrader
            - Mitch
            - Idrawline
            - Orangie
            - Dior100x
            - Jack Duval
            - Flur
            - Murad
            - Mert Mumtaz
            - Toly
            - Frank DeGods
            - Wendy O

            The FORMAT must be a specific content medium like:
            - Twitter Thread (10/10)
            - Podcast Clip
            - Unhinged Meme
            - Technical Analysis Chart
            - Spaces Rant
            - Discord Leak
            - Telegram Alpha Call
            - Notes App Apology
            - Lifestyle Flex Video
            - Governance Proposal

            Return ONLY a JSON object with the key "theme" containing the string "ENTITY | FORMAT".
            Example: {"theme": "Ansem | Twitter Thread (10/10)"}`,
        messages: [
          {
            role: "user",
            content: "Generate a new theme.",
          },
        ],
      }),
    })

    const data = await response.json()
    let theme = "Murad | Twitter Thread (10/10)" // Default fallback

    try {
      const contentText = data.content[0].text
      const content = JSON.parse(contentText)
      if (content.theme) {
        theme = content.theme
      }
    } catch (e) {
      console.error("Failed to parse Claude response", e)
    }

    return new Response(JSON.stringify({ theme }), { headers: { ...corsHeaders, "Content-Type": "application/json" } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
