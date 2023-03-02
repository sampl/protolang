import Popover from '@/styles/Popover'
import styled from 'styled-components/macro'

export default ({ ipa }) => {
  // debugger
  if (!ipa) return 'NO IPA'
  const syllables = ipa?.split('.')
  if (!syllables || syllables.length < 1) return 'SPLIT ISSUE'
  return <SyllablesWrapper>
    {syllables.map( (syllable, index) => {
      return <Popover
        key={syllable+index}
        target={<SyllableWrapper>{syllable || 'NO TEXT'}</SyllableWrapper>}
        content={<div>
          <p>IPA: {ipa}</p>
          {/* <p>Stress: {syllable.stress}</p> */}
        </div>}
      />
    })}
  </SyllablesWrapper>
}

export const SyllablesWrapper = styled.span`
  display: inline-flex;
  gap: .25rem;
`
export const SyllableWrapper = styled.span`
  cursor: pointer;
  border-radius: 3px;
  background: #eee;
`
