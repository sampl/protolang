import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseDictionaries = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'dictionaries' }
})

// https://supabase.com/docs/reference/javascript/select
// https://supabase.com/docs/reference/javascript/using-filters
// https://supabase.com/docs/reference/javascript/using-modifiers
// TODO - are dependencies and pause the same thing? Why run w/o dependencies?
export function useSupabaseQuery(query, dependencies, pause) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const runQuery = async () => {
      // TODO - does this fire too much?
      const { data, error } = await query
      setLoading(false)
      setData(data)
      setError(error)
    }
    !pause && runQuery()
    return () => {
      setData(null)
      setLoading(true)
      setError(null)
    }
  }, dependencies || [])

  return [
    data,
    loading,
    error,
  ]
}
