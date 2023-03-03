// import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

import { Badge } from '@/styles/Badge'
import { TwoColumns } from '@/styles/Layout'
import LanguagePicker from '../languages/LanguagePicker'

export default () => {
  // const navigate = useNavigate()

  return <>

    <h1>Language learning for serious learners</h1>
    <p>
      {/* Don't waste time playing games. */}
      Protolang's powerful language tools get you to fluency faster
    </p>
    <p style={{fontSize: 'small'}}>Free & open source · no account required</p>

    <TwoColumns cols="2fr 1fr">
      <div>
        <blockquote>"It's like Duolingo for adults" - Joe Flateau</blockquote>

        {/* <p>A complete toolbox for language acquisition:</p> */}
        <p>Protolang includes:</p>
        <ul>
          <li>
            <strong>🧑‍🏫 Lessons</strong>
            {' - '}
            complete courses in vocabulary, pronunciation, grammar, tenses, common phrases, and culture
          </li>
          <li>
            <strong>🤔 Audio flashcards</strong>
            {' - '}
            practice your knowledge with simple, interactive audio and text quizzes
          </li>
          <li>
            <strong>💬 AI Chat</strong>
            {' - '}
            realistic AI-powered conversations in your target language
          </li>
          <li>
            <strong>📺 Immersive media</strong>
            {' - '}
            videos, tv, podcasts, and radio in your target language
          </li>
          <li>
            <strong>📖 Dictionaries</strong>
            {' - '}
            100k+ word definitions with pronunciation and conjugations
          </li>
          <li>
            <strong>💡 Mnemonics</strong>
            {' - '}
            tips and tricks from our community to help you retain vocabulary
          </li>
          <li>
            <strong>📈 Analytics</strong>
            {' - '}
            track your progress toward fluency with vocabulary, days practiced, and more
          </li>
          <li>
            <strong>🏰 Stories &amp; prompts</strong>
            <Badge>Coming soon</Badge>
            {' - '}
            read and write about realistic scenarios matched to your skill level
          </li>
          <li>
            <strong>👨‍👩‍👧‍👦 Community</strong>
            <Badge>Coming soon</Badge>
            {' - '}
            practice with other language learners from around the world
          </li>
        </ul>

        <p>Why Protolang?</p>
        <ul>
          <li>
            <strong>Learn your own way</strong>
            {' - '}
            Protolang doesn't prescribe learning paths. Choose the lessons and tools that work for you.
          </li>
          {/* <li>
            <strong>Focus on listening and speaking</strong>
            {' - '}
            Protolang includes reading and writing, but focuses you on audio—the way we all learned our first language
          </li> */}
          <li>
            <strong>Digital immersion</strong>
            {' - '}
            Protolang immediately surrounds you with your new language without ever leaving your seat, with audio, video, chat, and more
          </li>
          <li>
            <strong>Built on open data</strong>
            {' - '}
            Protolang uses vast, publicly-available datasets and the latest browser technology to make learning richer than ever before
          </li>
          <li>
            <strong>No games</strong>
            {' - '}
            Protolang doesn't reward you with fake jewels. Instead, it gets you closer to conversations with real people.
          </li>
        </ul>

        <p>
          Considering a switch?
          {' '}
          <a href="/about">Compare to Duolingo</a>
        </p>
      </div>
      <div>
        <CtaWrapper>
          <LanguagePicker />
        </CtaWrapper>
      </div>
    </TwoColumns>

  </>
}

const CtaWrapper = styled.div`
  position: sticky;
  top: 2rem;
`
