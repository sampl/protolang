import styled from 'styled-components/macro'

import { useReferencePanel } from '@/_state/reference'
import SearchBox from './SearchBox'
import Definition from '../dictionary/Definition'
import TranslatePane from './TranslatePane'

export default () => {
  const {
    mode,
    setMode,
    query,
    referenceIsOpen,
    setReferenceIsOpen,
  } = useReferencePanel()

  return <ReferencePanelWrapper onClick={() => setReferenceIsOpen(true)}>
    <ReferencePanelToggle
      style={{height: referenceIsOpen ? '2rem' : '0rem'}}
      onClick={ e => {
        // e.preventDefault()
        e.stopPropagation()
        setReferenceIsOpen(!referenceIsOpen)
      }}
    >
      {referenceIsOpen ? '↓' : '↑'}
    </ReferencePanelToggle>
    <SearchBox />
    <ReferencePanelTabs>
      <ReferencePanelTab $selected={ mode === 'dictionary'} onClick={() => setMode('dictionary')}>dictionary</ReferencePanelTab>
      <ReferencePanelTab $selected={ mode === 'translate' } onClick={() => setMode('translate' )}>translate</ReferencePanelTab>
    </ReferencePanelTabs>
    <ReferencePanelContent>
      { mode === 'dictionary' && <Definition wordString={query} /> }
      { mode === 'translate' && <TranslatePane wordString={query} /> }
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
  background: white;
`
const ReferencePanelToggle = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  border-bottom: 1px solid;
  background: white;
`
const ReferencePanelTabs = styled.div`
  margin: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid;
`
const ReferencePanelTab = styled.button`
  text-align: center;
  padding: 0.5rem 0;
  text-decoration: none;
  /* cursor: pointer; */
  border-bottom: ${props => props.$selected ? '2px solid black' : '2px solid white'};
`
const ReferencePanelContent = styled.div`
  overflow-y: auto;
  padding: 1rem 1rem;
`