import { createContext, useContext, useState } from 'react'

const Context = createContext()

export default ({ children }) => {

  // dictionary, translate, grammar
  const [mode, setMode] = useState('dictionary')
  const [query, setQuery] = useState('')
  const [referenceIsOpen, setReferenceIsOpen] = useState(false)

  const exposed = {
    mode,
    setMode,
    query,
    setQuery,
    referenceIsOpen,
    setReferenceIsOpen,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useReferencePanel = () => useContext(Context)
