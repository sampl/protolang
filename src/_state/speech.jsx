import { createContext, useState, useEffect, useContext } from 'react'

import { useLanguage } from './language'

const Context = createContext()

// based on https://codepen.io/matt-west/pen/DpmMgE
export default ({ children }) => {
  const { currentLanguageCode, currentLanguage } = useLanguage()

  const speechIsSupported = 'speechSynthesis' in window

  const [voice, setVoice] = useState()

  const loadVoices = () => {
    const voices = speechSynthesis.getVoices()
    const langVoices = voices.filter(voice => {
      const voiceLangCode = voice.lang?.substring(0,2)
      return voiceLangCode == currentLanguageCode
    })
    // console.log(langVoices.map(v => v.name).join(' | '))
    const voice = langVoices[1] || langVoices[0]
    setVoice(voice)
  }

  useEffect(loadVoices, [currentLanguageCode])
  window.speechSynthesis.onvoiceschanged = () => loadVoices()

  const speak = (text) => {
    var msg = new SpeechSynthesisUtterance()
    
    msg.text = text
    msg.volume = .5  // 0 to 1
    msg.rate = .7    // 0.1 to 10
    msg.pitch = .8   // 0 to 2
    msg.voice = voice

    window.speechSynthesis.speak(msg)
  }

  const exposed = {
    speechIsSupported,
    speak,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useSpeech = () => useContext(Context)
