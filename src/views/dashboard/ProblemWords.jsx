import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

export default () => {

  const { user } = useUser()

  const [{ data: words, error, fetching }] = useSelect('user_word_scores', {
    columns: '*, word(*)',
    pause: !user,
    filter: useFilter(
      (query) => query
        .eq('created_by', user?.id)
        .order('percent_correct', { ascending: true })
        .limit(5),
      [user?.id],
    ),
  })

  return <>
    <h3>Problem words</h3>
    {
      !user ? 'Sign in to see the words you make the most mistakes on' :
      error ? error.message :
      fetching ? 'loading...' :
      (!words || words.length <= 0) ? 'no problem words!' :
      words?.map(word => <ProblemWordsListItem key={word?.word.id} percent={word.percent_correct} word={word.word} /> )
    }
  </>
}

const ProblemWordsListItem = ({ word, percent }) => {
  const { lang: urlLang } = useParams()
  return <div>
    <Link to={`/${urlLang}/words/${word.id}`}>{word.name}</Link>
    {' - '}
    {Math.round(percent * 100)}% correct
  </div>
}
