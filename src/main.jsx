import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
// import LogRocket from 'logrocket'

import Router from '@/Router'
import UserProvider from '@/_state/user'
import LanguageProvider from '@/_state/language'
import SpeechSynthesisProvider from '@/_state/speechSynthesis'
import SpeechRecognitionProvider from '@/_state/speechRecognition'
import '@/styles/variables.css'
import '@/styles/main.css'

console.log('*-*-* PROTOLANG *-*-*')

// LogRocket
// LogRocket.init('protolang/protolang-web')

// Sentry
const environment = import.meta.env.VITE_ENVIRONMENT
console.log('Environment:', environment)

Sentry.init({
  environment,

  dsn: "https://8a39776e883f4130989e1e9ec2cf5185@o393330.ingest.sentry.io/4504774867877888",
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // https://docs.sentry.io/platforms/javascript/guides/react/session-replay/
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new BrowserTracing(),
    new Sentry.Replay(),
  ],
})

// TODO - react router integration? only if we don't use next
// https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/

// give sentry errors a logrocket session url
// https://app.logrocket.com/protolang/protolang-web/settings/integrations/
// LogRocket.getSessionURL(sessionURL => {
//   Sentry.configureScope(scope => {
//     scope.setExtra("sessionURL", sessionURL)
//   })
// })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <LanguageProvider>
        <SpeechSynthesisProvider>
          <SpeechRecognitionProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </SpeechRecognitionProvider>
        </SpeechSynthesisProvider>
      </LanguageProvider>
    </UserProvider>
  </React.StrictMode>
)
