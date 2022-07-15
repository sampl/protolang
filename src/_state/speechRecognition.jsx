import { createContext, useState, useEffect, useContext } from 'react'

const Context = createContext()

// https://www.google.com/intl/en/chrome/demos/speech.html
export default ({ children }) => {
  const speechRecognitionIsSupported = 'webkitSpeechRecognition' in window

  const [recognitionObject, setRecognitionObject] = useState({})
  const [recognitionState, setRecognitionState] = useState('waiting')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')

  const setUpRecognition = () => {

    var recognition = new webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'it-IT' // TODO - get language from context so it's not hard-coded italian

    recognition.onstart = () => {
      setRecognitionState('listening')
    }
  
    recognition.onresult = event => {
      setInterimTranscript('')
      if (typeof(event.results) == 'undefined') {
        recognition.onend = null
        recognition.stop()
        alert('Sorry, your browser does not support speech recognition. Try Chrome!')
        return
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        const newResult = event.results[i]
        if (newResult.isFinal) {
          const text = newResult[0].transcript
          setFinalTranscript(ft => ft+' '+text)
        } else {
          const text = newResult[0].transcript
          setInterimTranscript(it => it+' '+text)
        }
      }
    }

    recognition.onerror = event => {
      if (event.error == 'no-speech') {
        setRecognitionState('error_no_speech')
      }
      if (event.error == 'audio-capture') {
        setRecognitionState('error_no_microphone')
      }
      if (event.error == 'not-allowed') {
        setRecognitionState('error_not_allowed')
      }
    }

    recognition.onend = () => {
      setRecognitionState('waiting')
    }

    setRecognitionObject(recognition)
  }

  useEffect(setUpRecognition, [])

  const toggleSpeechRecognition = () => {
    if (recognitionState === 'listening') {
      recognitionObject.stop()
    } else {
      setFinalTranscript('')
      setInterimTranscript('')
      recognitionObject.start()
    }
  }

  const exposed = {
    speechRecognitionIsSupported,
    toggleSpeechRecognition,
    recognitionState,
    interimTranscript,
    finalTranscript,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useSpeechRecognition = () => useContext(Context)
