
import { useSpeech } from "@/_state/speech"

export default ({ word }) => {
  const { speechIsSupported, speak } = useSpeech()
  return <button
    onClick={() => speak(word.name)}
    disabled={!speechIsSupported}
  >
    Speak
  </button>
}
