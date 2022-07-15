
import { useSpeechSynthesis } from "@/_state/speechSynthesis"

export default ({ word }) => {
  const { speechSynthesisIsSupported, speak } = useSpeechSynthesis()
  return <button
    onClick={() => speak(word.name)}
    disabled={!speechSynthesisIsSupported}
  >
    Speak
  </button>
}
