import { useFilter, useSelect } from 'react-supabase'

export default ({ string }) => {

  const [{ data, error, fetching }] = useSelect('mnemonics', {
    columns: '*, mnemonic_votes(*)',
    filter: useFilter(
      (query) => query.eq('target_phrase', string),
      [string],
    ),
  })

  const mnemonic = data && data[0]

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      !mnemonic ? null :
      <em>
        {mnemonic.remember_method}
      </em>
    }
  </div>
}
