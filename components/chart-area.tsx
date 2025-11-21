"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CHART_DATA } from "@/lib/data"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 shadow-xl">
        <p className="mb-2 font-mono text-xs text-gray-400">Time: {label}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs font-bold text-blue-500">TEAM BLUE</p>
            <div className="space-y-0.5 font-mono text-[10px] text-gray-300">
              <div className="flex justify-between gap-2">
                <span>O:</span>
                <span>{data.blue.open.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>H:</span>
                <span>{data.blue.high.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>L:</span>
                <span>{data.blue.low.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>C:</span>
                <span>{data.blue.close.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold text-red-500">TEAM RED</p>
            <div className="space-y-0.5 font-mono text-[10px] text-gray-300">
              <div className="flex justify-between gap-2">
                <span>O:</span>
                <span>{data.red.open.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>H:</span>
                <span>{data.red.high.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>L:</span>
                <span>{data.red.low.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>C:</span>
                <span>{data.red.close.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function ChartArea() {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#0a0a0a]">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="absolute inset-0 flex flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h2 className="text-3xl font-bold text-white">CHART RACE</h2>
            <span className="font-mono text-xl text-green-500">LIVE</span>
          </div>
          <div className="flex gap-2">
            {["1H", "4H", "1D", "1W"].map((tf) => (
              <button
                key={tf}
                className="rounded px-2 py-1 text-xs font-bold text-gray-500 hover:bg-white/10 hover:text-white"
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis
                orientation="right"
                tick={{ fill: "#666", fontSize: 10, fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />

              {/* Blue Team Wick */}
              <Bar dataKey={(d) => [d.blue.low, d.blue.high]} barSize={1} fill="#3B82F6" xAxisId={0} />
              {/* Blue Team Body */}
              <Bar
                dataKey={(d) => [Math.min(d.blue.open, d.blue.close), Math.max(d.blue.open, d.blue.close)]}
                barSize={6}
                xAxisId={0}
              >
                {CHART_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-blue-${index}`}
                    fill={entry.blue.close > entry.blue.open ? "#3B82F6" : "#1d4ed8"}
                    fillOpacity={entry.blue.close > entry.blue.open ? 1 : 0.5}
                  />
                ))}
              </Bar>

              {/* Red Team Wick */}
              <Bar dataKey={(d) => [d.red.low, d.red.high]} barSize={1} fill="#EF4444" xAxisId={0} />
              {/* Red Team Body */}
              <Bar
                dataKey={(d) => [Math.min(d.red.open, d.red.close), Math.max(d.red.open, d.red.close)]}
                barSize={6}
                xAxisId={0}
              >
                {CHART_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-red-${index}`}
                    fill={entry.red.close > entry.red.open ? "#EF4444" : "#991b1b"}
                    fillOpacity={entry.red.close > entry.red.open ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
