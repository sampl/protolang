import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import Router from '@/Router'
import UserProvider from '@/_state/user'
import LanguageProvider from '@/_state/language'
import SpeechSynthesisProvider from '@/_state/speechSynthesis'
import SpeechRecognitionProvider from '@/_state/speechRecognition'
import ReferenceProvider from '@/_state/reference'
import '@/styles/variables.css'
import '@/styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <LanguageProvider>
        <ReferenceProvider>
          <SpeechSynthesisProvider>
            <SpeechRecognitionProvider>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </SpeechRecognitionProvider>
          </SpeechSynthesisProvider>
        </ReferenceProvider>
      </LanguageProvider>
    </UserProvider>
  </React.StrictMode>
)
