import { createContext, useState, useEffect, useContext } from 'react'
import { useUser } from '@/_state/user'
import { useSelect, useFilter } from 'react-supabase'

// import { supabase } from '@/_util/supabaseClient'

const Context = createContext()

const Provider = ({ children }) => {
  const { user } = useUser()

  const filter = useFilter(
    (query) => query.eq('user', user.id),
    [user.id],
  )

  const [{ data: userLanguages, error, fetching }] = useSelect('user_languages', {
    columns: '*, language(*)',
    filter,
  })

  const [currentLanguageId, setCurrentLanguageId] = useState()

  if (!currentLanguageId && userLanguages) {
    setCurrentLanguageId(userLanguages[0].language?.id)
  }
  const currentLanguage = userLanguages?.find(ul => ul.language?.id === currentLanguageId) || {}

  const exposed = {
    userLanguages,
    currentLanguage,
    currentLanguageId,
    setCurrentLanguageId,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useLanguage = () => useContext(Context)

export default Provider