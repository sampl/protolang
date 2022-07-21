import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReactSupabaseProvider } from 'react-supabase'

import Routes from '@/Routes'
import { supabase } from '@/_util/supabaseClient'
import UserProvider from '@/_state/user'
import LanguageProvider from '@/_state/language'
import SpeechSynthesisProvider from '@/_state/speechSynthesis'
import SpeechRecognitionProvider from '@/_state/speechRecognition'
import '@/styles/variables.css'
import '@/styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactSupabaseProvider value={supabase}>
      <UserProvider>
        <LanguageProvider>
          <SpeechSynthesisProvider>
            <SpeechRecognitionProvider>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </SpeechRecognitionProvider>
          </SpeechSynthesisProvider>
        </LanguageProvider>
      </UserProvider>
    </ReactSupabaseProvider>
  </React.StrictMode>
)
