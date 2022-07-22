
import { useSpeechSynthesis } from "@/_state/speechSynthesis"

export default ({ word, wordString }) => {
  const { speechSynthesisIsSupported, speak } = useSpeechSynthesis()
  return <button
    onClick={() => speak(word?.name || wordString)}
    disabled={!speechSynthesisIsSupported}
  >
    Speak
  </button>
}
