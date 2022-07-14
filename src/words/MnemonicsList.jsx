import { useFilter, useSelect } from 'react-supabase'

import NewMnemonic from '@/words/NewMnemonic'

export default ({ wordId }) => {

  const filter = useFilter(
    (query) => query.eq('word', wordId),
    [wordId],
  )

  const [{ data: mnemonics, error, fetching }] = useSelect('mnemonics', {
    columns: '*, mnemonic_votes(*)',
    filter,
  })

  return <div>
    <NewMnemonic wordId={wordId} />

    {error && error.message}
    {fetching && 'loading...'}
    {
      (!mnemonics || mnemonics.length <= 0)
      ?
      'no mnemonics'
      :
      mnemonics.map(mnemonic => <MnemonicsListItem key={mnemonic.id} mnemonic={mnemonic} />)
    }
  </div>
}

const MnemonicsListItem = ({mnemonic}) => {
  return <div>
    {mnemonic.content_en} - {mnemonic.mnemonic_votes.length} vote(s)
  </div>
}
