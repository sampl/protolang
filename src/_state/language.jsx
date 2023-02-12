import { createContext, useContext, useState } from 'react'
import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()

  const [ currentLanguageId, setCurrentLanguageId ] = useState()

  let CLQuery = supabase
    .from('languages')
    .select()
    .eq('id', currentLanguageId)
    .single()
  const [currentLanguage, CLLoading, CLError] = useSupabaseQuery(CLQuery, [currentLanguageId], !currentLanguageId)

  let ULQuery = supabase
    .from('user_languages')
    .select('*, language(*)')
  let [userLanguages, ULLoading, ULError] = useSupabaseQuery(ULQuery, [user?.id], !user)

  const exposed = {
    loading: CLLoading || ULLoading,
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
