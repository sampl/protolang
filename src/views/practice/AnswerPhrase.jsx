import { useParams, Link } from 'react-router-dom'
// import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { useUser } from '@/_state/user'
import SpeakWord from "../dictionary/SpeakWord"
import Definable from "../lessons/Definable"
import AnswerWord from './AnswerWord'
import PhraseScore from './PhraseScore'
import PhraseEdit from './PhraseEdit'

// import { supabase, useSupabaseQuery } from '@/db/supabase'
// import CardDeck from '@/views/practice/CardDeck'
// import { TwoColumns } from '@/styles/Layout'
// import DailyProgress from './DailyProgress'

// Play the sound in english
// play in Italian
// see alternates in both languages
// see your score for this phrase
// See the lessons that include this phrase
// Diff the two phrases to see differences
// Show your answer with clickable words

export default ({ phrase }) => {
  const { isAdmin } = useUser()
  const { langId } = useParams()

  if (!phrase) return ''
  return <>
    <PhraseWrapper>
      <strong style={{fontSize: 'large'}}>
        <Definable wordString={phrase.content_ita} />
        <SpeakWord wordString={phrase.content_ita} />
      </strong>
      {phrase.content_ita_alts && phrase.content_ita_alts.length > 0 && <div>
        or
        {' '}
        {phrase.content_ita_alts?.map(alt => {
          return <span key={alt}>
            <Definable wordString={alt} />
          </span>
        })}
      </div>}

      <br />

      <p>{phrase.content_eng}</p>
      {phrase.content_eng_alts && phrase.content_eng_alts.length > 0 && <p>Other meanings: {phrase.content_eng_alts?.join(', ')}</p>}

      {isAdmin && <PhraseEdit phrase={phrase} />}

      {/* TODO - attempts list? */}
      <h3>
        Your accuracy:
        {' '}
        <PhraseScore phrase={phrase} />
      </h3>
    </PhraseWrapper>

    {phrase.content_ita?.split(' ').map((word, i) => <AnswerWord key={i} wordString={word} />)}
  </>
}

export const PhraseWrapper = styled.div`
  border: 1px solid;
  padding: 2rem;
  background: #fafafa;
  margin: 2rem 0;
`
