// import { useNavigate } from 'react-router-dom'

// import { Button } from '@/styles/Button'
import { Badge } from '@/styles/Badge'
import { OneCol } from '@/styles/Layout'
import LanguagePicker from '../user_languages/LanguagePicker'

export default () => {
  // let navigate = useNavigate()

  return <OneCol>

    <h1>Coming soon: the language site for serious learners</h1>
    {/* <Button onClick={() => navigate('/languages')}>Choose your language</Button> */}
    <p>Free & open source{/* · no account required */}</p>

    <blockquote>
      "It's like Duolingo for adults" - Joe Flateau
    </blockquote>

    <p>Protolang includes:</p>
    <ul>
      <li>
        <strong>🧑‍🏫 Lessons</strong>
        {' - '}
        interactive courses in vocabulary, pronunciation, grammar, and culture
      </li>
      <li>
        <strong>🤔 Flashcards</strong>
        {' - '}
        practice your knowledge with simple, interactive audio and text quizzes
      </li>
      <li>
        <strong>💡 Mnemonics</strong>
        {' - '}
        tips to help you retain words without rote memorization
      </li>
      <li>
        <strong>📖 Dictionaries</strong>
        {' - '}
        instant word definitions, tenses, and conjugations
      </li>
      <li>
        <strong>📺 Media</strong>
        {' - '}
        watch and listen: videos, podcasts, radio and more
      </li>
      <li>
        <strong>📈 Analytics</strong>
        {' - '}
        track your vocabulary, days practiced, and more
      </li>
      <li>
        <strong>💬 Chat</strong>
        <Badge>Coming soon</Badge>
        {' - '}
        realistic AI-powered conversations in your target language
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
      <li>
        <strong>🌍 Resources</strong>
        <Badge>Coming soon</Badge>
        {' - '}
        other apps to round out your knowledge, ranked by our community
      </li>
    </ul>

    <p>Why Protolang?</p>
    <ul>
      <li>
        <strong>Freedom to learn your way</strong>
        {' - '}
        No fake prizes or narrow learning paths. Choose the lessons and tools that work for you.
      </li>
      <li>
        <strong>Focus on listening and speaking</strong>
        {' - '}
        Protolang includes reading and writing, but focuses you on audio—the way we all learned our first language
      </li>
      <li>
        <strong>Immersive environment</strong>
        {' - '}
        Protolang surrounds you with your new language without ever leaving your seat
      </li>
      <li>
        <strong>Built on open data</strong>
        {' - '}
        Protolang uses vast, publicly-available datasets and the latest browser technology to make learning richer than ever before
      </li>
    </ul>

    {/* <p>
      Considering a switch?
      {' '}
      <a href="">Compare to Duolingo</a>
    </p> */}

    <LanguagePicker />

  </OneCol>
}
