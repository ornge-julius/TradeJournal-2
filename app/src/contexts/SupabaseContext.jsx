import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, checkSupabaseConnection } from '../lib/supabase'

const SupabaseContext = createContext()

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection()
        setIsConnected(connected)
      } catch (error) {
        console.error('Failed to check Supabase connection:', error)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  const value = {
    supabase,
    isConnected,
    isLoading
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
