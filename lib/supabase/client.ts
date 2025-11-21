import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://zdxkmfujsrriwrlbembt.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGttZnVqc3JyaXdybGJlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTA3NDcsImV4cCI6MjA3OTIyNjc0N30.gXmtd8fjK0YDflaHFA-wUXxNIoOJ6guqpbN68zHeVus"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("[v0] Missing Supabase environment variables in client")
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
