import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from './Routes'
import './index.css'
import { Provider as ReactSupabaseProvider } from 'react-supabase'
import { supabase } from './supabaseClient'
import UserProvider from './user'
import { BrowserRouter } from "react-router-dom";

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
