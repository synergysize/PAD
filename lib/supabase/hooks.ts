"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "./client"
import type { Game, Player, GamePhase, RoundCondition } from "@/lib/data"

const supabaseUrl = "https://zdxkmfujsrriwrlbembt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGttZnVqc3JyaXdybGJlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTA3NDcsImV4cCI6MjA3OTIyNjc0N30.gXmtd8fjK0YDflaHFA-wUXxNIoOJ6guqpbN68zHeVus";

// Hook to subscribe to a specific game's state
export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !gameId) {
      setLoading(false)
      return
    }

    const fetchGame = async () => {
      const { data, error } = await supabase.from("games").select("*").eq("id", gameId).single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data) {
        setGame({
          id: data.id,
          theme: data.theme,
          phase: data.phase as GamePhase,
          roundCondition: data.round_condition as RoundCondition | null,
          conditionRevealed: data.condition_revealed,
          phaseEndsAt: data.phase_ends_at,
          totalPot: data.total_pot,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        })
      }
      setLoading(false)
    }

    fetchGame()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`game_${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const newGame = payload.new
          setGame({
            id: newGame.id,
            theme: newGame.theme,
            phase: newGame.phase as GamePhase,
            roundCondition: newGame.round_condition as RoundCondition | null,
            conditionRevealed: newGame.condition_revealed,
            phaseEndsAt: newGame.phase_ends_at,
            totalPot: newGame.total_pot,
            createdAt: newGame.created_at,
            updatedAt: newGame.updated_at,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId])

  return { game, loading, error }
}

// Hook to get the latest active game
export function useLatestGame() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchLatestGame = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setGameId(data.id)
      }
      setLoading(false)
    }

    fetchLatestGame()
  }, [])

  return { gameId, loading }
}

// Hook to subscribe to players in a game
export function useGamePlayers(gameId: string | null) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !gameId) {
      setLoading(false)
      return
    }

    const fetchPlayers = async () => {
      const { data, error } = await supabase.from("players").select("*").eq("game_id", gameId)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data) {
        const mappedPlayers: Player[] = data.map((player: any) => ({
          id: player.id,
          nickname: player.nickname,
          walletAddress: player.wallet_address,
          padsBalance: player.pads_balance || 0,
          solBalance: Number.parseFloat(player.sol_balance) || 0,
          teamBet: player.team_bet || 0,
          soloBet: player.solo_bet || 0,
          status: player.status as "active" | "eliminated",
          avatar: player.team === "blue" ? "/cyberpunk-avatar-blue.png" : "/cyberpunk-avatar-red.jpg",
          team: player.team as "blue" | "red",
          gameId: player.game_id,
        }))
        setPlayers(mappedPlayers)
      }
      setLoading(false)
    }

    fetchPlayers()

    // Subscribe to real-time player updates
    const channel = supabase
      .channel(`players_${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          fetchPlayers()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId])

  return { players, loading, error }
}

// Hook to create a new game
export function useCreateGame() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createGame = useCallback(async (initialTheme?: string) => {
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase client not initialized")
      return null
    }

    setLoading(true)
    setError(null)

    let theme = initialTheme

    if (!theme) {
      try {
        const { data, error } = await supabase.functions.invoke("generate-theme")
        if (data && data.theme) {
          theme = data.theme
        } else {
          console.warn("Failed to generate theme, using fallback")
          theme = "Murad | Twitter Thread (10/10)"
        }
      } catch (err) {
        console.error("Error invoking generate-theme:", err)
        theme = "Murad | Twitter Thread (10/10)"
      }
    }

    const { data, error: createError } = await supabase
      .from("games")
      .insert({
        theme,
        phase: "JOINING",
        round_condition: Math.random() > 0.5 ? "BULLISH" : "BEARISH",
        condition_revealed: false,
        total_pot: 0,
      })
      .select()
      .single()

    setLoading(false)

    if (createError) {
      setError(createError.message)
      return null
    }

    return data?.id || null
  }, [])

  return { createGame, loading, error }
}

// Hook to join a game
export function useJoinGame() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const joinGame = useCallback(async (gameId: string, walletAddress: string, team: "blue" | "red") => {
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase client not initialized")
      return null
    }

    setLoading(true)
    setError(null)

    const { data, error: joinError } = await supabase
      .from("players")
      .insert({
        game_id: gameId,
        wallet_address: walletAddress,
        team,
        pads_balance: 1000,
        sol_balance: 0.1,
      })
      .select()
      .single()

    setLoading(false)

    if (joinError) {
      setError(joinError.message)
      return null
    }

    return data?.id || null
  }, [])

  return { joinGame, loading, error }
}

// Hook to place a bet
export function usePlaceBet() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const placeBet = useCallback(async (playerId: string, amount: number, betType: "team" | "solo") => {
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase client not initialized")
      return false
    }

    setLoading(true)
    setError(null)

    const updateField = betType === "team" ? "team_bet" : "solo_bet"

    const { error: betError } = await supabase
      .from("players")
      .update({ [updateField]: amount })
      .eq("id", playerId)

    setLoading(false)

    if (betError) {
      setError(betError.message)
      return false
    }

    return true
  }, [])

  return { placeBet, loading, error }
}

// Hook to submit a prompt
export function useSubmitPrompt() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitPrompt = useCallback(async (gameId: string, playerId: string, text: string, team: "blue" | "red") => {
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase client not initialized")
      return null
    }

    setLoading(true)
    setError(null)

    const { data, error: promptError } = await supabase
      .from("prompts")
      .insert({
        game_id: gameId,
        player_id: playerId,
        text,
        team,
        status: "pending",
      })
      .select()
      .single()

    setLoading(false)

    if (promptError) {
      setError(promptError.message)
      return null
    }

    return data?.id || null
  }, [])

  return { submitPrompt, loading, error }
}
