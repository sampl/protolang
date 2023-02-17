import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {

  const { langId } = useParams()

  const query = supabase
    .from('media')
    .select()
    .eq('language_id', langId)
  const [media, loading, error] = useSupabaseQuery(query, [langId])

  return <>
    <h1>Media</h1>
    <Link to={`/${langId}/media/new`}>+ Add media item</Link>

    <hr />

    {
      error ? error.message :
      loading ? 'loading...' :
      (!media || media.length <= 0) ? 'no media' :
      media.map(mediaItem => <MediaListItem key={mediaItem.id} mediaItem={mediaItem} />)
    }
  </>
}

const MediaListItem = ({mediaItem}) => {
  const { langId } = useParams()

  return <div>
    <Link to={`/${langId}/media/${mediaItem.id}`}>
      {mediaItem.url || 'Unknown url'}
    </Link>
  </div>
}
