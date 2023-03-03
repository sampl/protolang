import * as Diff from 'diff'
import Definable from '../lessons/Definable'

export default ({
  correctAnswer,
  guess,
}) => {
  if (correctAnswer === guess) return null
  const diff = Diff.diffWords(guess, correctAnswer) 
  return <div style={{padding: '.5rem', background: '#eee', fontWeight: '500'}}>
    {diff.map((part, i) => {
      const value = part.value.trim()
      return <span key={i}>
        {
          part.added ?
            <span style={{color: 'green'}}>
              <Definable wordString={value} />
            </span>
          :
          part.removed ?
            <span style={{color: 'red'}}>
              <Definable wordString={value} />
            </span>
          :
          <Definable wordString={value} />
        }
      </span>
    })}
  </div>
}
