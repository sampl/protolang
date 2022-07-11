import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider as ReactSupabaseProvider } from 'react-supabase'
import { supabase } from './supabaseClient'
import UserProvider from './user'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactSupabaseProvider value={supabase}>
      <UserProvider>
        <App />
      </UserProvider>
    </ReactSupabaseProvider>
  </React.StrictMode>
)
