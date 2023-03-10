// import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import styled from 'styled-components/macro'

const AccordionComponent = ({ items }) => {
  return <AccordionWrapper>
    <Accordion.Root type="multiple" default={[]} collapsible>
      {items.map( (item, index) => {
        return <AccordionItem value={index+1} key={index+1}>
          <AccordionHeader>
            <AccordionTrigger>{item.title}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      })}
    </Accordion.Root>
  </AccordionWrapper>
}

const AccordionWrapper = styled.div`
  margin-bottom: 1rem;
`
const AccordionItem = styled(Accordion.Item)`
  border-bottom: 1px solid;
`
const AccordionHeader = styled(Accordion.Header)`
  margin: 0;
`
const AccordionTrigger = styled(Accordion.Trigger)`
  display: block;
  width: 100%;
  font-weight: bold;
  padding: 1rem 0;
  text-decoration: none;
  /* &:hover {
    text-decoration: underline;
  } */
`
const AccordionContent = styled(Accordion.Content)`
  overflow: hidden;

  &[data-state='open'] {
    animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  &[data-state='closed'] {
    animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`

export default AccordionComponent
