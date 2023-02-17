import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import MediaVote from './MediaVote'

export default () => {
  const { mediaId } = useParams()

  const query = supabase
    .from('media')
    .select('*, media_votes(*)')
    .eq('id', mediaId)
    .single()
  const [media, loading, error] = useSupabaseQuery(query, [mediaId])

  return <>
    {
      error ? error.message :
      loading ? 'loading...' :
      !media ? 'no media found' :
      <>
        <h1>{media.url}</h1>
        <a href={media.url} target="_blank">View media ↗</a>
        <MediaVote media={media} />
      </>
    }
  </>
}
