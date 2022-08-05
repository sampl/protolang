
import { useSpeechSynthesis } from "@/_state/speechSynthesis"

export default ({ word, wordString, disabled }) => {
  const { speechSynthesisIsSupported, speak } = useSpeechSynthesis()
  return <button
    onClick={() => speak(word?.name || wordString || '')}
    disabled={!speechSynthesisIsSupported || disabled}
  >
    Speak
  </button>
}
