import { useSpeechRecognition } from "@/_state/speechRecognition"
import { useEffect } from "react"

export default ({ word, testAnswer, testPartialAnswer, submitAnswer, disabled }) => {

  const {
    speechRecognitionIsSupported,
    startSpeechRecognition,
    stopSpeechRecognition,
    clearSpeechRecognition,
    recognitionState,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition()

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
  }, [])
  
  // test new transcripts
  useEffect( () => {
    const isCorrect = testAnswer(interimTranscript) || testAnswer(finalTranscript)
    const isCorrectSoFar = testPartialAnswer(finalTranscript)
    const hasNotStarted = !finalTranscript || finalTranscript === ''

    if (isCorrect) {
      stopSpeechRecognition()
      submitAnswer(finalTranscript)
    }

    if (hasNotStarted || isCorrectSoFar) {
      // wait
      console.log('waiting...')
      return
    }

    debugger
    // TODO - this isn't working... new cards still have the old transcripts and fail the test on load before speech. not getting cleared? need a state to test whether we started listening or something?

    // end if it's just plain wrong
    if (!isCorrect) {
      console.log('wrong answer', finalTranscript, 'should be', word.name)
      stopSpeechRecognition()
      submitAnswer(finalTranscript)
      return
    }
  }, [interimTranscript, finalTranscript])

  return <>
    <p>Speak the Italian for...</p>
    <h2>{word?.translation_en}</h2>

    <code><strong>{finalTranscript}</strong> {interimTranscript}</code>
    {!disabled && <button onClick={recognitionState === 'listening' ? stopSpeechRecognition : startSpeechRecognition}>
      {recognitionState === 'listening' ? 'Listening...' : 'Listen'}
    </button>}
  </>
}
