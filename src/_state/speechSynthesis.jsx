import { createContext, useState, useEffect, useContext } from 'react'

import { useLanguage } from './language'

const Context = createContext()

// based on https://codepen.io/matt-west/pen/DpmMgE
export default ({ children }) => {
  // console.log(useLanguage())
  const { currentLanguage } = useLanguage()

  const speechSynthesisIsSupported = 'speechSynthesis' in window

  const [voice, setVoice] = useState()

  const loadVoices = () => {
    const voices = speechSynthesis.getVoices()
    const langVoices = voices.filter(voice => {
      const voiceLangCode = voice.lang?.substring(0,2)
      return voiceLangCode == currentLanguage?.id
    })
    // console.log(langVoices.map(v => v.name).join(' | '))
    const voice = langVoices[1] || langVoices[0]
    setVoice(voice)
  }

  useEffect(loadVoices, [currentLanguage?.id])
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
    speechSynthesisIsSupported,
    speak,
  }

  return <Context.Provider value={exposed}>
    {children}
  </Context.Provider>
}

export const useSpeechSynthesis = () => useContext(Context)
