import { createContext, useContext, useState } from 'react'
import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()

  const [ currentLanguageId, setCurrentLanguageId ] = useState()

  const CLQuery = supabase
    .from('languages')
    .select()
    .eq('id', currentLanguageId)
    .single()
  const [currentLanguage, CLLoading, CLError] = useSupabaseQuery(CLQuery, [currentLanguageId], !currentLanguageId)

  const ULQuery = supabase
    .from('user_languages')
    .select('*, language_id(*)')
    .eq('created_by', user?.id)
  const [userLanguages, ULLoading, ULError] = useSupabaseQuery(ULQuery, [user?.id], !user)

  const loading = CLLoading || (ULLoading && user?.id) // if user is not logged in, ULLoading will "pause" and load forever

  const exposed = {
    loading,
    error: CLError || ULError,
    userLanguages: userLanguages || [],
    currentLanguage: currentLanguage || {},
    setCurrentLanguageId,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useLanguage = () => useContext(Context)
