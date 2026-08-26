import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here"
)

if (!isConfigured) {
  console.warn(
    "[Supabase] Missing or default environment variables. Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  )
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
)

export const isSupabaseConfigured = isConfigured
