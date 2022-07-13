import { Link } from 'react-router-dom'
import { useSelect } from 'react-supabase'

import Layout from '@/_layout/Layout'

export default function Words() {

  const [{ data: words, error, fetching }] = useSelect('words', {
    columns: '*, language(*)',
  })

  return <Layout>
    <h1>Words</h1>
    {error && error.message}
    {fetching && 'loading...'}
    {
      (!words || words.length <= 0)
      ?
      'no words'
      :
      words.map(word => <WordListItem key={word.id} word={word} />)
    }
  </Layout>
}

const WordListItem = ({word}) => {
  return <>
    <Link to={`/words/${word.id}`}>
      {word.name} - ({word.translation_en}) - {word.language.name_en}
    </Link>
    <br/>
  </>
}
