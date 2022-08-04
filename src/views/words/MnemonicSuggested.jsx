import { useFilter, useSelect } from 'react-supabase'

export default ({ word }) => {

  const filter = useFilter(
    (query) => query.eq('word', word?.id),
    [word?.id],
  )

  const [{ data, error, fetching }] = useSelect('mnemonics', {
    columns: '*, mnemonic_votes(*)',
    filter,
  })
  console.log(data)

  const mnemonic = data && data[0]

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      !mnemonic ? null :
      <blockquote>
        {mnemonic.content_en} - {mnemonic.mnemonic_votes.length} vote(s)
      </blockquote>
    }
  </div>
}