import { createContext, useState, useContext } from 'react'
import { useUser } from '@/_state/user'
import { useSelect, useFilter } from 'react-supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()

  const [{ data: allLanguages, error: languagesError, fetching: fetchingLanguages }] = useSelect('languages')

  const filter = useFilter(
    (query) => query.eq('created_by', user?.id),
    [user?.id],
  )

  const [{ data: userLanguages, error: userLanguagesError, fetching: fetchingUserLanguages }] = useSelect('user_languages', {
    columns: '*, language(*)',
    filter,
  })

  const [currentLanguageId, setCurrentLanguageId] = useState()

  if (!currentLanguageId && userLanguages && userLanguages[0]) {
    setCurrentLanguageId(userLanguages[0].language?.id)
  }
  const currentLanguage = userLanguages?.find(ul => ul.language?.id === currentLanguageId) || {}
  const currentLanguageCode = currentLanguageId?.slice(-2)

  const exposed = {
    allLanguages,
    userLanguages,
    currentLanguage,
    currentLanguageId,
    currentLanguageCode,
    setCurrentLanguageId,
    loading: fetchingUserLanguages || fetchingLanguages,
    error: userLanguagesError || languagesError,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useLanguage = () => useContext(Context)
