import { createContext, useContext, useState } from 'react'
import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()

  const [ currentLanguageId, setCurrentLanguageId ] = useState()

  // TODO - don't fetch all languages when there's no user, just the relevant ones
  // This logic is ported from the old react-supabase code, but it's weirdly inconsistent
  let withUserQuery = supabase
    .from('languages')
    .select(user?.id ? '*, user_languages(*)' : '*')
    .eq('user_languages.created_by', user?.id)
  let withoutUserQuery = supabase
    .from('languages')
    .select()
  const [languages, loading, error] = useSupabaseQuery(user?.id ? withUserQuery : withoutUserQuery, [user?.id])

  const userLanguages = languages?.filter(l => l.user_languages && l.user_languages.length > 0)
  const currentLanguage = languages?.find(l => l.id === currentLanguageId)

  const exposed = {
    loading,
    error,
    languages,
    userLanguages,
    currentLanguage,
    setCurrentLanguageId,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useLanguage = () => useContext(Context)
