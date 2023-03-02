
import { useSpeechSynthesis } from "@/_state/speechSynthesis"

export default ({ wordString, disabled }) => {
  const { speechSynthesisIsSupported, speak } = useSpeechSynthesis()
  return <button
    className="button"
    onClick={() => speak(wordString || '')}
    disabled={!speechSynthesisIsSupported || disabled}
  >
    🔈
  </button>
}
