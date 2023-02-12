import { createContext, useState, useEffect, useContext } from 'react'

import { supabase } from '@/db/supabase'

const Context = createContext()

export default ({ children }) => {
  const [user, setUser] = useState(null)

  const isBetaUser = !!localStorage.getItem('protolang_is_beta_user')

  useEffect(() => {
    const getUserProfile = async () => {
      const { data, error } = await supabase.auth.getSession()
      const user = data?.session?.user
      // const { session: { user } } = data

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single()

        setUser({
          ...user,
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
