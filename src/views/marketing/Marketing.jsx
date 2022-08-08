import { useNavigate } from 'react-router-dom'

import { Button } from '@/styles/Button'
import { OneCol } from '@/styles/Layout'
// import Modal from '@/styles/Modal'

export default () => {
  let navigate = useNavigate()

  return <OneCol>

    {/* <Modal close={() => navigate('/languages')}> */}
      {/* <h1>Learn a foreign language, faster than you ever thought possible</h1> */}
      <h1>The language site for serious learners</h1>
      {/* <p>Language learning site for serious language learners.</p> */}
      <Button onClick={() => navigate('/languages')}>Choose your language</Button>
      <p>Free forever · open source · no account required</p>
      {/* Join 10,000 learners broadening their horizons */}

      <hr />

      {/* <blockquote>
        "Straight to the dome"
      </blockquote> */}
      <blockquote>
        "It's like Duolingo for adults" - Joe Flateau
      </blockquote>

      <h2>Why Protolang?</h2>
      <ul>
        <li>
          <strong>No games</strong>
          <p>We don't tease you with fake prizes or force your down a narrow path. We just make everything available up-front and let you choose the lessons that you need.</p>
          {/* <p><em>Example: food, workplace, family</em></p> */}
        </li>
        {/* <li>
          <strong>Memorization tricks built-in</strong>
          <p>Hints from our community help you memorize vocabulary fast</p>
          <p><em>Example: to remember that caber is Spanish for "to fit inside", imagine a bear fitting inside a taxi cab</em></p>
        </li> */}
        <li>
          <strong>Powerful analytics</strong>
          <p>To learn faster, we show you where you're succeeding and where you need to focus most.</p>
          {/* <p><em>Example: vocabulary score over time, daily heatmap, most difficult words</em></p> */}
        </li>
      </ul>

      <h2>More features</h2>
      <ul>
        <li>In-depth language lessons</li>
        <li>Customizable flashcards</li>
        <li>Speech recognition</li>
        <li>Speech synthesis</li>
      </ul>

      <p>
        Protolang is 100% free to use and open source
      </p>

      {/* <p>
        Considering a switch?
        {' '}
        <a href="">Compare to Duolingo</a>
      </p> */}

      <h2>Start learning</h2>
      <p>100% free, no account required</p>
      <Button onClick={() => navigate('/languages')}>Choose your language</Button>
    {/* </Modal> */}

  </OneCol>
}
