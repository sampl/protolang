import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ string }) => {

  const query = supabase
    .from('mnemonics')
    .select('*, mnemonic_votes(*)')
    .eq('target_phrase', string)
  const [mnemonics, loading, error] = useSupabaseQuery(query, [string], !string)

  let mnemonic
  if (mnemonics?.length > 0) {
    mnemonic = mnemonics[0]
  }
  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      !mnemonic ? null :
      <em>
        {mnemonic.remember_method}
      </em>
    }
  </div>
}
