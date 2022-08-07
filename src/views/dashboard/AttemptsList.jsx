import { useFilter, useSelect } from 'react-supabase'

export default ({ userId }) => {

  const [{ data: attempts, error, fetching }] = useSelect('attempts', {
    columns: '*, word(*)',
    pause: !user,
    filter: useFilter(
      (query) => query.eq('created_by', userId),
      [userId],
    ),
  })

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!attempts || attempts.length <= 0) ? `You haven't tried any flashcards yet` :
      attempts.map(attempt => <AttemptsListItem key={attempt?.id} attempt={attempt} />)
    }
  </div>
}

const AttemptsListItem = ({attempt}) => {
  return <div>
    {attempt.created_at}: {attempt.word.name} {attempt.word.translation_en} - "{attempt.guess}" {attempt.correct ? '✅' : '❌'}
  </div>
}
