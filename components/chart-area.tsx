"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, CrosshairMode, type IChartApi, CandlestickSeries } from "lightweight-charts"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react" // Import Loader2

interface ChartAreaProps {
  gameId?: string
}

export function ChartArea({ gameId }: ChartAreaProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const blueSeriesRef = useRef<any>(null)
  const redSeriesRef = useRef<any>(null)
  const [bluePrice, setBluePrice] = useState<number>(1000)
  const [redPrice, setRedPrice] = useState<number>(1000)
  const [processingPrompt, setProcessingPrompt] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
      },
    })

    chartRef.current = chart

    // Create series using the new v5 API
    const blueSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#3B82F6",
      downColor: "#1d4ed8",
      borderVisible: false,
      wickUpColor: "#3B82F6",
      wickDownColor: "#1d4ed8",
    })
    blueSeriesRef.current = blueSeries

    const redSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#EF4444",
      downColor: "#991b1b",
      borderVisible: false,
      wickUpColor: "#EF4444",
      wickDownColor: "#991b1b",
    })
    redSeriesRef.current = redSeries

    // Subscribe to crosshair moves for price updates
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const bluePriceData = param.seriesData.get(blueSeries) as any
        const redPriceData = param.seriesData.get(redSeries) as any

        if (bluePriceData) setBluePrice(bluePriceData.close || bluePriceData.value)
        if (redPriceData) setRedPrice(redPriceData.close || redPriceData.value)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [])

  // Fetch and process data
  useEffect(() => {
    if (!gameId || !supabase) return

    const fetchData = async () => {
      // Trigger processing of pending prompts
      try {
        await fetch("/api/games/process-prompts", { method: "POST" }).catch(() => {})
      } catch (e) {
        // Ignore errors
      }

      // Fetch completed prompts
      const { data: prompts, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("game_id", gameId)
        .eq("status", "completed")
        .order("submitted_at", { ascending: true })

      if (error || !prompts) return

      // Process Blue Team
      const bluePrompts = prompts.filter((p) => p.team === "blue")
      const blueData = stitchCandles(bluePrompts)
      if (blueSeriesRef.current && blueData.length > 0) {
        blueSeriesRef.current.setData(blueData)
        setBluePrice(blueData[blueData.length - 1].close)
      }

      // Process Red Team
      const redPrompts = prompts.filter((p) => p.team === "red")
      const redData = stitchCandles(redPrompts)
      if (redSeriesRef.current && redData.length > 0) {
        redSeriesRef.current.setData(redData)
        setRedPrice(redData[redData.length - 1].close)
      }

      // Check for processing prompts
      const { data: processing } = await supabase
        .from("prompts")
        .select("text")
        .eq("game_id", gameId)
        .eq("status", "processing")
        .limit(1)
        .maybeSingle()

      if (processing) {
        setProcessingPrompt(processing.text)
      } else {
        setProcessingPrompt(null)
      }
    }

    // Initial fetch
    fetchData()

    // Poll every 3 seconds
    const interval = setInterval(fetchData, 3000)

    return () => clearInterval(interval)
  }, [gameId, supabase])

  // Helper to stitch candles
  const stitchCandles = (prompts: any[]) => {
    const stitchedData: any[] = []
    let lastClose = 1000
    // Start time: 1 hour ago
    let currentTime = Math.floor(Date.now() / 1000) - 3600

    prompts.forEach((prompt) => {
      if (!prompt.candles || !Array.isArray(prompt.candles)) return

      const firstOpen = prompt.candles[0].open
      const offset = lastClose - firstOpen

      prompt.candles.forEach((candle: any, index: number) => {
        stitchedData.push({
          time: (currentTime + index * 60) as any,
          open: candle.open + offset,
          high: candle.high + offset,
          low: candle.low + offset,
          close: candle.close + offset,
        })
      })

      lastClose = stitchedData[stitchedData.length - 1].close
      currentTime += prompt.candles.length * 60
    })

    return stitchedData
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-[#0a0a0a]">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="absolute inset-0 flex flex-col p-6">
        <div className="mb-4 flex items-center justify-between z-10">
          <div className="flex items-baseline gap-6">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-white">CHART RACE</h2>
              <span className="font-mono text-xl text-green-500 animate-pulse">LIVE</span>
            </div>

            {/* Live Prices */}
            <div className="flex gap-4 font-mono text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-blue-500 font-bold">{bluePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-500 font-bold">{redPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {processingPrompt && (
            <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" /> {/* Loader2 is now declared */}
              Processing: "{processingPrompt.substring(0, 30)}..."
            </div>
          )}

          <div className="flex gap-2">
            {["1H", "4H", "1D", "1W"].map((tf) => (
              <button
                key={tf}
                className="rounded px-2 py-1 text-xs font-bold text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-full w-full" ref={chartContainerRef} />
      </div>
    </div>
  )
}
