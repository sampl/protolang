import { useFilter, useSelect } from 'react-supabase'

import NewMnemonic from '@/views/dictionary/NewMnemonic'

export default ({ string }) => {

  // TODO - get with full text search?
  const [{ data: mnemonics, error, fetching }] = useSelect('mnemonics', {
    columns: '*, mnemonic_votes(*)',
    filter: useFilter(
      (query) => query.eq('target_phrase', string),
      [string],
    ),
  })

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!mnemonics || mnemonics.length <= 0)
      ?
      'no mnemonics'
      :
      mnemonics.map(mnemonic => <MnemonicsListItem key={mnemonic.id} mnemonic={mnemonic} />)
    }
    <br />
    <NewMnemonic string={string} />
  </div>
}

const MnemonicsListItem = ({mnemonic}) => {
  return <div>
    {mnemonic.remember_method} - {mnemonic.mnemonic_votes.length} vote(s)
    {/* TODO - allow voting here */}
  </div>
}