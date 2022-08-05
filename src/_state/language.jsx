import { createContext, useState, useContext, useEffect } from 'react'
import { useUser } from '@/_state/user'
import { useSelect, useFilter } from 'react-supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()
  
  const [{ data, error, fetching }] = useSelect('languages', {
    columns: '*, user_languages(*)',
    filter: useFilter(
      (query) => query.eq('user_languages.created_by', user?.id),
      [user?.id],
    ),
  })

  // TODO - make code the same as ID ("lang_it" vs "it")
  const languages = data?.map(l => ({
    code: l.id?.slice(-2),
    ...l,
  }))

  const userLanguages = languages?.filter(l => l.user_languages && l.user_languages.length > 0)

  const [currentLanguageId, setCurrentLanguageId] = useState()

  // ensure returning users automatically have a language set
  // TODO - should save their most recently used language
  useEffect( () => {
    if (!currentLanguageId && userLanguages && userLanguages[0]) {
      setCurrentLanguageId(userLanguages[0].id)
    }
  }, [currentLanguageId, userLanguages])

  const currentLanguage = userLanguages?.find(ul => ul.id === currentLanguageId) || {}

  const exposed = {
    fetching,
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
