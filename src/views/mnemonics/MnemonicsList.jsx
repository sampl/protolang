import { supabase, useSupabaseQuery } from '@/db/supabase'

import MnemonicNew from '@/views/mnemonics/MnemonicNew'
import MnemonicVote from '@/views/mnemonics/MnemonicVote'
import { useUser } from '@/_state/user'

export default ({ wordString }) => {
  const { user } = useUser()

  // TODO - get with full text search?
  const query = supabase
    .from('mnemonics')
    .select(`
      *,
      all_votes:mnemonic_votes(*),
      user_votes:mnemonic_votes(*)
    `)
    .eq('target_phrase', wordString)
    .eq('user_votes.created_by', user?.id)
  const [mnemonics, loading, error] = useSupabaseQuery(query, [wordString])

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      (!mnemonics || mnemonics.length <= 0) ? 'no mnemonics' :
      mnemonics.map(mnemonic => <MnemonicsListItem key={mnemonic.id} mnemonic={mnemonic} />)
    }
    <br />
    <MnemonicNew wordString={wordString} />
  </div>
}

const MnemonicsListItem = ({mnemonic}) => {
  return <div>
    <MnemonicVote mnemonic={mnemonic} />
    {mnemonic.remember_method} - {mnemonic.all_votes?.length} vote(s)
    {/* TODO - allow voting here */}
  </div>
}
