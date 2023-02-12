import { supabase, useSupabaseQuery } from '@/db/supabase'
import NewMnemonic from '@/views/dictionary/NewMnemonic'

export default ({ string }) => {

  // TODO - get with full text search?
  let query = supabase
    .from('mnemonics')
    .select('*, mnemonic_votes(*)')
    .eq('target_phrase', string)
  const [mnemonics, loading, error] = useSupabaseQuery(query, [string])

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
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
