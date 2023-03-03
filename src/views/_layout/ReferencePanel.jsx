import styled from 'styled-components/macro'

import { useReferencePanel } from '@/_state/reference'
import SearchBox from './SearchBox'
import Definition from '../dictionary/Definition'

export default () => {
  const {
    mode,
    setMode,
    query,
    referenceIsOpen,
    setReferenceIsOpen,
  } = useReferencePanel()

  return <ReferencePanelWrapper>
    <ReferencePanelToggle onClick={ ()=> setReferenceIsOpen(!referenceIsOpen) }>{referenceIsOpen ? '→' : '←'}</ReferencePanelToggle>
    <SearchBox />
    <div style={{padding: '0 1rem'}}>
      <button style={{background: mode === 'dictionary' && '#aaa'}} onClick={() => setMode('dictionary')}>dictionary</button>
      <button style={{background: mode === 'translate'  && '#aaa'}} onClick={() => setMode('translate' )}>translate</button>
      <button style={{background: mode === 'grammar'    && '#aaa'}} onClick={() => setMode('grammar'   )}>grammar</button>
    </div>
    <ReferencePanelContent>
      { mode === 'dictionary' && <Definition wordString={query} /> }
      { mode === 'translate' && 'translate todo' }
      { mode === 'grammar' && 'grammar todo' }
    </ReferencePanelContent>
  </ReferencePanelWrapper>
}

const ReferencePanelWrapper = styled.div`
  border: 1px solid;
  width: 100%;
  position: sticky;
  top: 2rem;
  height: 100%;
  box-shadow: 2px 2px;
  display: flex;
  flex-direction: column;
`
const ReferencePanelToggle = styled.button`
  position: absolute;
  top: 1rem;
  left: -3rem;
  width: 3rem;
  height: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid;
  background: white;
`
const ReferencePanelContent = styled.div`
  overflow-y: auto;
  margin-top: 1rem;
  padding: 1rem 1rem 0;
  border-top: 1px solid;
`