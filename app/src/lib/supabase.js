import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('trades').select('count').limit(1)
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to connect to Supabase:', error)
    return false
  }
}
