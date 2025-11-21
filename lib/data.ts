export type PlayerStatus = "active" | "eliminated"

export type RoundCondition = "BULLISH" | "BEARISH"

export interface Player {
  id: string
  nickname: string | null
  walletAddress: string
  padsBalance: number
  solBalance: number
  teamBet: number
  soloBet: number
  status: PlayerStatus
  avatar: string
  team: "blue" | "red"
  gameId: string
}

export type GamePhase = "JOINING" | "TEAM_BETTING" | "PROMPTS" | "SOLO_BETTING" | "RACE" | "RESULTS"

export interface Game {
  id: string
  theme: string
  phase: GamePhase
  roundCondition: RoundCondition | null
  conditionRevealed: boolean
  phaseEndsAt: string | null
  totalPot: number
  createdAt: string
  updatedAt: string
}

export interface Prompt {
  id: string
  author: string
  text: string
  timestamp: number
  status: "pending" | "processing" | "completed"
  team: "blue" | "red"
}

export interface TeamCandleData {
  open: number
  close: number
  high: number
  low: number
}

export interface CandlestickData {
  time: number
  blue: TeamCandleData
  red: TeamCandleData
}

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    author: "CryptoKing",
    text: "Generate a cyberpunk city with neon rain",
    timestamp: 1700000000000,
    status: "processing",
    team: "blue",
  },
  {
    id: "2",
    author: "BearWhale",
    text: "Create a dystopian market crash scene",
    timestamp: 1700000010000,
    status: "pending",
    team: "red",
  },
  {
    id: "3",
    author: "SatoshiN",
    text: "Design a futuristic crypto wallet interface",
    timestamp: 1700000020000,
    status: "pending",
    team: "blue",
  },
  {
    id: "4",
    author: "RedRanger",
    text: "Visualize a bull run as a mechanical beast",
    timestamp: 1700000030000,
    status: "completed",
    team: "red",
  },
  {
    id: "5",
    author: "DiamondHands",
    text: "Draw a diamond hand holding a rocket",
    timestamp: 1700000040000,
    status: "completed",
    team: "blue",
  },
]

export const MOCK_PLAYERS: Player[] = [
  {
    id: "1",
    nickname: null,
    walletAddress: "0x71C...9A2",
    padsBalance: 1337,
    solBalance: 0.05,
    teamBet: 500,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-blue.png",
    team: "blue",
    gameId: "game1",
  },
  {
    id: "2",
    nickname: null,
    walletAddress: "0x3B2...1C4",
    padsBalance: 2500,
    solBalance: 1.2,
    teamBet: 1000,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-blue-2.jpg",
    team: "blue",
    gameId: "game1",
  },
  {
    id: "3",
    nickname: null,
    walletAddress: "0x9A1...8B3",
    padsBalance: 100,
    solBalance: 0.01,
    teamBet: 0,
    soloBet: 0,
    status: "eliminated",
    avatar: "/cyberpunk-avatar-blue-3.jpg",
    team: "blue",
    gameId: "game1",
  },
  {
    id: "4",
    nickname: null,
    walletAddress: "0x1D4...5E6",
    padsBalance: 5000,
    solBalance: 2.5,
    teamBet: 1500,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-blue-4.jpg",
    team: "blue",
    gameId: "game1",
  },
  {
    id: "5",
    nickname: null,
    walletAddress: "0x8F2...3D1",
    padsBalance: 8000,
    solBalance: 5.0,
    teamBet: 2000,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-red.jpg",
    team: "red",
    gameId: "game1",
  },
  {
    id: "6",
    nickname: null,
    walletAddress: "0x4E1...9C2",
    padsBalance: 450,
    solBalance: 0.1,
    teamBet: 100,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-red-2.jpg",
    team: "red",
    gameId: "game1",
  },
  {
    id: "7",
    nickname: null,
    walletAddress: "0x2B3...7A4",
    padsBalance: 0,
    solBalance: 0.0,
    teamBet: 0,
    soloBet: 0,
    status: "eliminated",
    avatar: "/cyberpunk-avatar-red-3.jpg",
    team: "red",
    gameId: "game1",
  },
  {
    id: "8",
    nickname: null,
    walletAddress: "0x6C5...1F8",
    padsBalance: 3333,
    solBalance: 1.5,
    teamBet: 1200,
    soloBet: 0,
    status: "active",
    avatar: "/cyberpunk-avatar-red-4.jpg",
    team: "red",
    gameId: "game1",
  },
]

export const CHART_DATA: CandlestickData[] = Array.from({ length: 50 }, (_, i) => {
  const baseBlue = 1000 + Math.sin(i * 0.2) * 100 + i * 5
  const baseRed = 1000 + Math.cos(i * 0.2) * 100 + i * 5
  const volatility = 20

  const generateCandle = (base: number): TeamCandleData => {
    const open = base + (Math.random() - 0.5) * volatility
    const close = base + (Math.random() - 0.5) * volatility
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    return { open, close, high, low }
  }

  return {
    time: i,
    blue: generateCandle(baseBlue),
    red: generateCandle(baseRed),
  }
})
