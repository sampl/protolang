import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  let { id } = useParams()

  let query = supabase
    .from('media')
    .select('*, media_ratings(*)')
    .eq('id', id)
    .single()
  const [media, loading, error] = useSupabaseQuery(query, [id])

  return <>
    {
      error ? error.message :
      loading ? 'loading...' :
      !media ? 'no media found' :
      <>
        <h1>{media.url}</h1>
        <a href={media.url} target="_blank">Visit media ↗</a>
        <br />
        {
          (!media.media_ratings || media.media_ratings.length <= 0) ? 'no ratings' :
          media.media_ratings.map(mediaRating => {
            return <div key={mediaRating.id}>{mediaRating.stars} star(s): {mediaRating.content}</div>
          })
        }
      </>
    }
  </>
}
