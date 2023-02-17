import { supabase, useSupabaseQuery } from '@/db/supabase'

import MnemonicNew from '@/views/mnemonics/MnemonicNew'
import MnemonicVote from '@/views/mnemonics/MnemonicVote'
import { useUser } from '@/_state/user'

export default ({ string }) => {
  const { user } = useUser()

  // TODO - get with full text search?
  const query = supabase
    .from('mnemonics')
    .select(`
      *,
      all_votes:mnemonic_votes(*),
      user_votes:mnemonic_votes(*)
    `)
    .eq('target_phrase', string)
    .eq('user_votes.created_by', user?.id)
  const [mnemonics, loading, error] = useSupabaseQuery(query, [string])

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      (!mnemonics || mnemonics.length <= 0) ? 'no mnemonics' :
      mnemonics.map(mnemonic => <MnemonicsListItem key={mnemonic.id} mnemonic={mnemonic} />)
    }
    <br />
    <MnemonicNew string={string} />
  </div>
}

const MnemonicsListItem = ({mnemonic}) => {
  return <div>
    <MnemonicVote mnemonic={mnemonic} />
    {mnemonic.remember_method} - {mnemonic.all_votes?.length} vote(s)
    {/* TODO - allow voting here */}
  </div>
}
