import { useLanguage } from "@/_state/language"
import { useSpeechRecognition } from "@/_state/speechRecognition"
import { useEffect } from "react"
import { useTimer } from 'use-timer'

export default ({
  direction,
  correctAnswer,
  testAnswer,
  testPartialAnswer,
  submitAnswer,
  disabled,
  id,
}) => {

  const { currentLanguage } = useLanguage()
  const {
    speechRecognitionIsSupported,
    startSpeechRecognition,
    stopSpeechRecognition,
    clearSpeechRecognition,
    recognitionState,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition()

  const { time, start, pause, reset, status } = useTimer({
    autostart: true,
    // interval: 100,
  })

  if (!speechRecognitionIsSupported) {
    return 'unfortunately speech is not supported in this browser'
  }

  useEffect(() => {
    // clear it out when card reloads
    stopSpeechRecognition()
    clearSpeechRecognition()
    
    // stop listening and reset when closed
    return () => {
      clearSpeechRecognition()
      stopSpeechRecognition()
    }
  }, [id])

  // test new transcripts
  useEffect( () => {
    const finalIsCorrect = testAnswer(interimTranscript)
    const interimIsCorrect = testAnswer(interimTranscript)
    const isCorrectSoFar = testPartialAnswer(finalTranscript)
    const hasNotStarted = !finalTranscript || finalTranscript === ''

    if (interimIsCorrect || finalIsCorrect) {
      const userCorrectAnswer = interimIsCorrect ? interimTranscript : finalTranscript
      console.log(`answer ${userCorrectAnswer} is correct, matches the answer "${correctAnswer}", submitting...`, {interimTranscript, finalTranscript})
      stopSpeechRecognition()
      submitAnswer(userCorrectAnswer)
    }

    if (hasNotStarted || isCorrectSoFar || time < 2) {
      // wait
      // console.log('waiting...')
      return
    }

    // end if it's just plain wrong
    // (we used to test for interim here too, seems wrong though)
    if (!finalIsCorrect) {
      console.log(finalTranscript, 'is wrong, does not match the answer "', correctAnswer, '", submitting...')
      stopSpeechRecognition()
      submitAnswer(finalTranscript)
      return
    }
  }, [interimTranscript, finalTranscript])

  const toggleSpeech = () => {
    if (recognitionState === 'listening') {
      stopSpeechRecognition()
    } else {
      const languageCode = direction === 'forward' ? currentLanguage.id : 'en'
      startSpeechRecognition(languageCode)
    }
  }
  return <>
    <button className="button" onClick={toggleSpeech} disabled={disabled} style={{fontSize: '20px', width: "100%"}}>
      {
        recognitionState === 'listening' ? 'Listening...' :
        'Click to speak'
      }
    </button>
    <code><strong>{finalTranscript}</strong> {interimTranscript}</code>
  </>
}
