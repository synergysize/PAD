export type Team = "blue" | "red"

export type PlayerStatus = "active" | "eliminated"

export interface Player {
  id: string
  name: string
  wallet: string
  bet: number
  status: PlayerStatus
  team: Team
  avatar: string
}

export type GamePhase = "JOINING" | "BETTING" | "PROMPTS" | "SIDE_BETS" | "RACE" | "RESULTS"

export interface Prompt {
  id: string
  author: string
  team: Team
  text: string
  timestamp: number
  status: "pending" | "processing" | "completed"
}

export interface CandlestickData {
  time: number
  blue: { open: number; close: number; high: number; low: number }
  red: { open: number; close: number; high: number; low: number }
}

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    author: "CryptoKing",
    team: "blue",
    text: "Generate a cyberpunk city with neon rain",
    timestamp: Date.now() - 5000,
    status: "processing",
  },
  {
    id: "2",
    author: "BearWhale",
    team: "red",
    text: "Create a dystopian market crash scene",
    timestamp: Date.now() - 15000,
    status: "pending",
  },
  {
    id: "3",
    author: "SatoshiN",
    team: "blue",
    text: "Design a futuristic crypto wallet interface",
    timestamp: Date.now() - 30000,
    status: "pending",
  },
  {
    id: "4",
    author: "RedRanger",
    team: "red",
    text: "Visualize a bull run as a mechanical beast",
    timestamp: Date.now() - 45000,
    status: "completed",
  },
  {
    id: "5",
    author: "DiamondHands",
    team: "blue",
    text: "Draw a diamond hand holding a rocket",
    timestamp: Date.now() - 60000,
    status: "completed",
  },
]

export const MOCK_PLAYERS: Player[] = [
  {
    id: "1",
    name: "CryptoKing",
    wallet: "0x71C...9A2",
    bet: 5.2,
    status: "active",
    team: "blue",
    avatar: "/cyberpunk-avatar-blue.png",
  },
  {
    id: "2",
    name: "DiamondHands",
    wallet: "0x3B2...1C4",
    bet: 12.5,
    status: "active",
    team: "blue",
    avatar: "/cyberpunk-avatar-blue-2.jpg",
  },
  {
    id: "3",
    name: "MoonBoy",
    wallet: "0x9A1...8B3",
    bet: 2.1,
    status: "eliminated",
    team: "blue",
    avatar: "/cyberpunk-avatar-blue-3.jpg",
  },
  {
    id: "4",
    name: "SatoshiN",
    wallet: "0x1D4...5E6",
    bet: 8.8,
    status: "active",
    team: "blue",
    avatar: "/cyberpunk-avatar-blue-4.jpg",
  },
  {
    id: "5",
    name: "BearWhale",
    wallet: "0x8F2...3D1",
    bet: 15.0,
    status: "active",
    team: "red",
    avatar: "/cyberpunk-avatar-red.jpg",
  },
  {
    id: "6",
    name: "RedRanger",
    wallet: "0x4E1...9C2",
    bet: 4.5,
    status: "active",
    team: "red",
    avatar: "/cyberpunk-avatar-red-2.jpg",
  },
  {
    id: "7",
    name: "ShortSeller",
    wallet: "0x2B3...7A4",
    bet: 9.2,
    status: "eliminated",
    team: "red",
    avatar: "/cyberpunk-avatar-red-3.jpg",
  },
  {
    id: "8",
    name: "DegenLord",
    wallet: "0x6C5...1F8",
    bet: 20.0,
    status: "active",
    team: "red",
    avatar: "/cyberpunk-avatar-red-4.jpg",
  },
]

export const CHART_DATA: CandlestickData[] = Array.from({ length: 50 }, (_, i) => {
  const baseBlue = 1000 + Math.sin(i * 0.2) * 100 + i * 5
  const baseRed = 1000 + Math.cos(i * 0.2) * 100 + i * 5

  const volatility = 20

  const blueOpen = baseBlue + (Math.random() - 0.5) * volatility
  const blueClose = baseBlue + (Math.random() - 0.5) * volatility
  const blueHigh = Math.max(blueOpen, blueClose) + Math.random() * volatility
  const blueLow = Math.min(blueOpen, blueClose) - Math.random() * volatility

  const redOpen = baseRed + (Math.random() - 0.5) * volatility
  const redClose = baseRed + (Math.random() - 0.5) * volatility
  const redHigh = Math.max(redOpen, redClose) + Math.random() * volatility
  const redLow = Math.min(redOpen, redClose) - Math.random() * volatility

  return {
    time: i,
    blue: { open: blueOpen, close: blueClose, high: blueHigh, low: blueLow },
    red: { open: redOpen, close: redClose, high: redHigh, low: redLow },
  }
})
