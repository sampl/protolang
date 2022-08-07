import { useNavigate } from 'react-router-dom'
// import Modal from '@/styles/Modal'

export default () => {
  let navigate = useNavigate()

  return <>

    {/* <Modal close={() => navigate('/languages')}> */}
      <h1>Learn a foreign language, faster than you ever thought possible</h1>
      {/* <p>A powerful new way to learn. Unlock a world of new experiences with a powerful.</p> */}
      <button onClick={() => navigate('/languages')}>Choose your language</button>
      <p>Free forever · Open source · No account required</p>
      {/* Join 10,000 learners broadening their horizons */}

      <blockquote>
        "Straight to the dome"
      </blockquote>
      <blockquote>
        "It's like Duolingo for adults" - Joe Flateau
      </blockquote>

      <h2>Why Protolang?</h2>
      <ul>
        <li>
          <strong>Learn how you want to</strong>
          <p>We don't tease you with fake prizes or force your down a narrow path. We just make everything available up-front and let you choose the lessons that you need.</p>
          <p><em>Example: food, workplace, family</em></p>
        </li>
        <li>
          <strong>Memorization tricks built-in</strong>
          <p>Hints from our community help you memorize vocabulary fast</p>
          <p><em>Example: to remember that caber is Spanish for "to fit inside", imagine a bear fitting inside a taxi cab</em></p>
        </li>
        <li>
          <strong>Track your progress in detail</strong>
          <p>To learn faster, we show you where you're succeeding and where you need to focus most.</p>
          <p><em>Example: vocabulary score over time, daily heatmap, most difficult words</em></p>
        </li>
        <li>
          <strong>Free and open source</strong>
          <p>Made by a community of learners who believe learning should be free</p>
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
        Considering a switch?
        {' '}
        <a href="">Compare to Duolingo</a>
      </p>

      <button onClick={() => navigate('/languages')}>Choose your language</button>
    {/* </Modal> */}

  </>
}
