import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReactSupabaseProvider } from 'react-supabase'

import Routes from './Routes'
import { supabase } from './_util/supabaseClient'
import UserProvider from './_state/user'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactSupabaseProvider value={supabase}>
      <UserProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </UserProvider>
    </ReactSupabaseProvider>
  </React.StrictMode>
)
