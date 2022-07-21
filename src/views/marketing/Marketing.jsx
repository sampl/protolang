import { useNavigate } from 'react-router-dom'

export default () => {
  let navigate = useNavigate()

  return <>

    <h1>Learn a foreign language, faster than you ever thought possible</h1>
    {/* <p>A powerful new way to learn. Unlock a world of new experiences with a powerful.</p> */}
    <button onClick={() => navigate('/login')}>Start learning now</button>
    <p>Free forever · Open source · No account required to start</p>
    {/* Join 10,000 learners broadening their horizons */}

    <blockquote>
      "Straight to the dome"
    </blockquote>

    <hr />

    <h2>No more games</h2>
    <p>Instead of teasing you with fake prizes and forcing your down a specific path, we just make everything available up-front.</p>
    <blockquote>
      "It's like Duolingo for adults" - Joe Flateau
    </blockquote>

    <h2>Freedom to learn how you want</h2>
    <p>Choose the lessons that are relevant for your trip.</p>
    <p><em>Example: food, workplace, family</em></p>

    <h2>Memorization tricks built-in</h2>
    <p>Hints from our community help you memorize vocabulary fast</p>
    <p><em>Example: to remember that caber is Spanish for "to fit inside", imagine a bear fitting inside a taxi cab</em></p>

    <h2>Track your progress in detail</h2>
    <p>To learn faster, we show you where you're succeeding and where you need to focus most.</p>
    <p><em>Example: vocabulary score over time, daily heatmap, most difficult words</em></p>

    <h2>Free and open source</h2>
    <p>Made by a community of learners who believe learning should be free</p>
    <p>
        <a href="" disabled>License</a>
        {' · '}
        <a href="" disabled>Source</a>
        {' · '}
        <a href="" disabled>Contribute</a>
        {' · '}
        <a href="" disabled>Sponsor</a>
    </p>

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

    <button onClick={() => navigate('/login')}>Start learning</button>

  </>
}
