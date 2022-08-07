import { createContext, useContext, useState } from 'react'
import { useUser } from '@/_state/user'
import { useSelect, useFilter } from 'react-supabase'

const Context = createContext()

export default ({ children }) => {
  const { user } = useUser()

  const [ currentLanguageId, setCurrentLanguageId ] = useState()

  const [{ data, error, fetching }] = useSelect('languages', {
    columns: user?.id ? '*, user_languages(*)' : '*',
    filter: useFilter(
      (query) => user?.id ? query.eq('user_languages.created_by', user?.id) : query,
      [user?.id],
    ),
  })

  // make sure all langs have a "code" attr
  // TODO - make code the same as ID ("lang_it" vs "it")
  const languages = data?.map(l => ({
    code: l.id?.slice(-2),
    ...l,
  }))

  const userLanguages = languages?.filter(l => l.user_languages && l.user_languages.length > 0)

  const currentLanguage = languages?.find(l => l.id === currentLanguageId)

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
