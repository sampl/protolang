import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { Badge } from '@/styles/Badge'
import { TwoColumns } from '@/styles/Layout'
import OrBar from '@/styles/OrBar'
import LanguagePicker from '../languages/LanguagePicker'
import Accordion from '@/styles/Accordion'

const faqs = [
  {
    title: "What's wrong with apps like Duolingo?",
    content: <>
      <p>
        Lots of language apps make it easy to start learning by giving you a very narrow, prescriptive learning path. But this narrow path soon makes it difficult to make progress.
      </p>
      <p>
        Protolang takes the opposite approach: we open the floodgates and give immediate access to everything you need to learn. Instead of spoon-feeding you, our goal is to give you a rich language playground for you to explore.
      </p>
      <p>
        Here are some other differences between Protolang and Duolingo specifically:
      </p>
      <ul>
        <li>
          Duolingo rewards with users with fake prizes like digital coins, "gold", and status, while Protolang is focused on rewarding you with fluency.
        </li>
        <li>
          Duolingo is a large for-profit company backed by venture capitalists with proprietary, closed-source course content. Protolang is an open-source project with <Link to="/open-source">free, open-licensed content</Link> everyone can use and share for free.
        </li>
      </ul>
    </>
  },
  {
    title: "Is it really free?",
    content: <>
      <p>
        This website is free to use at no cost to anyone in the world.
      </p>
      <p>
        We may create a premium set of paid features in the future to help support the site, but the core experience will stay free. All contributions from our contributors will always be free under our <a href="/open-source">open licenses</a>.
      </p>
      <p>
        Improving and maintaining this site costs money and time. If you believe in our mission and you have the means to give, please <a href="/sponsor">consider becoming a sponsor</a>.
      </p>
    </>
  },
  {
    title: "What exactly do you mean by \"open source\"?",
    content: <>
      <p>
        Unlike Duolingo (and every other major learning app), all the source code of this website is freely available under a permissive <a href="https://en.wikipedia.org/wiki/Open-source_software">open-source license</a>. That means you can copy the code, run it on for free your own computer, and contribute your own features back to the site.
      </p>
      <p>
        The content of our lessons is also open source, which means you can download, print, and share these lessons for free (as long as you don't sell them for commercial profit). In theory, you could learn a language just by reading our lesson text and never use the website at all.
      </p>
      <p>
        Learn more about the <a href="/open-source">open source licenses we use</a>, or browse/fork the the <a href="https://github.com/sampl/protolang">source</a> yourself.
      </p>
    </>
  },
  {
    title: "Can I help?",
    content: <>
      <p>
        Yes! We are actively looking for multi-lingual volunteers, people with language teaching experience, and software developers to help build this site.
      </p>
      <p>
        All of your contributions are released under the same <a href="/open-source">open licenses</a>, which means they will be made indefinitely available for free to everyone in the world.
      </p>
      <p>
        Read our <a href="/contributing">contributor guidelines</a> to learn how to get started.
      </p>
      <p>
        If you believe in the mission and want to support server costs, you can also <a href="/sponsor">sponsor the project</a>.
      </p>
    </>
  },
  {
    title: "Will you add my favorite language?",
    content: <>
      <p>
        Because we are an open-source app, we need expertise from volunteers to add more languages.
      </p>
      <p>
        If you (or someone you know) speaks a language besides English and you want to help build a course, learn how to start by reading our <a href="/contributing">contributing guidelines</a>.
      </p>
    </>
  },
  {
    title: "Why does the website look old?",
    content: <>
      <p>
        While Protolang is in active early development, we're focusing on making it useful before we make it pretty. Stay tuned for style updates.
      </p>
    </>
  },
  {
    title: "Who made this?",
    content: <>
      <p>
        The Protolang app and website is built and maintained by our <a href="https://github.com/sampl/protolang/graphs/contributors">open-source contributors</a>.
        {/* Our lesson content is developed by our language volunteers with support from our sponsors—thank you! */}
      </p>
    </>
  },
]

export default () => {
  return <TwoColumns cols="2fr 1fr">
    <div>
      <h1>Language learning for serious learners</h1>
      <p style={{fontSize: 'large'}}>
        Open-source, AI-powered language tools that help you get you to fluency faster
      </p>
      {/* Don't waste time playing games. */}
      <p style={{fontSize: 'small'}}>Free & open source · no account required</p>

      <blockquote>"It's like Duolingo for adults" - Joe Flateau</blockquote>

      <br />

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
          <strong>💬 A.I. Chat</strong>
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
          <strong>Digital immersion</strong>
          {' - '}
          Protolang immediately surrounds you with your new language without ever leaving your seat, with audio, video, chat, and more
        </li>
        <li>
          <strong>Learn your own way</strong>
          {' - '}
          Protolang doesn't prescribe learning paths. Choose the lessons and tools that work for you.
        </li>
        <li>
          <strong>Focus on audio</strong>
          {' - '}
          Protolang has text-to-speech and speech-to-text everywhere, so you can learn the natural way: by listening and speaking.
        </li>
        <li>
          <strong>Built on open data</strong>
          {' - '}
          We use vast, publicly-available datasets and the latest browser technology to make learning richer than ever before
        </li>
        <li>
          <strong>No games</strong>
          {' - '}
          Protolang doesn't reward you with fake prizes. Instead, it gets you closer to conversations with real people.
        </li>
      </ul>

      <p>
        Considering a switch?
        {' '}
        <a href="/about">Compare to Duolingo</a>
      </p>


      <h2>FAQs</h2>
      <Accordion items={faqs} />

      <p>
        Have a question that's not answered here?
        {' '}
        <Link to="/contact">Contact us</Link>
      </p>

    </div>
    <div>
      <CtaWrapper>
        <Link className="button" style={{width: '100%'}} to="/signup">Create your account</Link>
        <OrBar />
        <LanguagePicker />
      </CtaWrapper>
    </div>
  </TwoColumns>
}

const CtaWrapper = styled.div`
  position: sticky;
  padding-top: 4rem;
  top: 0;
`
