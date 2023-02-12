import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ string }) => {

  let query = supabase
    .from('*, mnemonic_votes(*)')
    .select()
    .eq('target_phrase', string)
    .single()
  const [mnemonic, loading, error] = useSupabaseQuery(query, [string])

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
