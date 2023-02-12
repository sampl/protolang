import { createContext, useState, useEffect, useContext } from 'react'

import { supabase, useSupabaseQuery } from '@/db/supabase'

const Context = createContext()

export default ({ children }) => {
  const [user, setUser] = useState(null)
  const [userError, setUserError] = useState(null)
  const [userLoading, setUserLoading] = useState(true)

  const getAuthUser = async () => {
    setUserLoading(true)
    const { data, error } = await supabase.auth.getSession()
    const user = data?.session?.user
    setUser(user)
    setUserError(error)
    setUserLoading(false)
  }

  useEffect(() => {
    getAuthUser()
    supabase.auth.onAuthStateChange(getAuthUser)
    // TODO - return function that unsubscribes
  }, [])

  let query = supabase
    .from('profiles')
    .select()
    .eq('id', user?.id)
    .single()
  const [profile, profileLoading, profileError] = useSupabaseQuery(query, [user?.id], !user)

  const fullUser = user ? {
    ...user,
    ...profile,
  } : null

  const login = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const exposed = {
    user: fullUser,
    loading: userLoading || profileLoading,
    error: userError || profileError,
    login,
    logout,
    isBetaUser: !!localStorage.getItem('protolang_is_beta_user'),
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useUser = () => useContext(Context)
