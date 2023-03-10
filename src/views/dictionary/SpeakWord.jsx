
import { useSpeechSynthesis } from "@/_state/speechSynthesis"
import styled from 'styled-components/macro'

export default ({ wordString, disabled }) => {
  const { speechSynthesisIsSupported, speak } = useSpeechSynthesis()
  return <SpeakButton
    onClick={() => speak(wordString || '')}
    disabled={!speechSynthesisIsSupported || disabled}
  >
    🔈
  </SpeakButton>
}

const SpeakButton = styled.button`
  text-decoration: none;
  opacity: .7;
  padding: 0.15rem 0.33rem;
  border-radius: 3px;

  &:hover {
    opacity: 1;
    background: hsla(0, 0%, 50%, 0.1);
  }
`
