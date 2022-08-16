import { createContext, useState, useEffect, useContext } from 'react'

import { supabase } from '@/_util/supabaseClient'

const Context = createContext()

export default ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user())

  const isBetaUser = !!localStorage.getItem('protolang_is_beta_user')

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', sessionUser.id)
          .single()

        setUser({
          ...sessionUser,
          ...profile,
        })
      }
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const login = async (email) => {
    try {
      const { error } = await supabase.auth.signIn({ email })
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
    user,
    login,
    logout,
    isBetaUser,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useUser = () => useContext(Context)
