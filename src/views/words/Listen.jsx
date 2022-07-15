
import { useSpeechRecognition } from "@/_state/speechRecognition"

export default () => {

  const {
    speechRecognitionIsSupported,
    toggleSpeechRecognition,
    recognitionState,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition()

  if (!speechRecognitionIsSupported) {
    return 'unfortunately speech is not supported in this browser'
  }

  return <>
    <pre>{recognitionState}</pre>
    <button
      onClick={toggleSpeechRecognition}
      disabled={!speechRecognitionIsSupported}
    >
      {recognitionState === 'listening' ? 'Listening...' : 'Listen'}
    </button>
    <code><strong>{finalTranscript}</strong> {interimTranscript}</code>
  </>
}
