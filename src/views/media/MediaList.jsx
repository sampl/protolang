import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import TV from './TV'
import Radio from "./Radio"

export default () => {

  const { langId } = useParams()

  const [mediaIndex, setMediaIndex] = useState(0)

  const query = supabase
    .from('media')
    .select()
    .eq('language_id', langId)
  const [media, loading, error] = useSupabaseQuery(query, [langId])

  const nextMedia = () => {
    if (mediaIndex >= media.length - 1) {
      setMediaIndex(0)
    } else {
      setMediaIndex(mediaIndex + 1)
    }
  }
  const prevMedia = () => {
    if (mediaIndex <= 0) {
      setMediaIndex(media.length - 1)
    } else {
      setMediaIndex(mediaIndex - 1)
    }
  }

  const currentMedia = media && media[mediaIndex]

  return <>

    {
      error ? error.message :
      loading ? 'loading...' :
      (!media || media.length <= 0) ? 'no media' :
      <TV youtubeUrl={currentMedia?.url} onNext={nextMedia} onPrev={prevMedia} />
    }
    {/* media.map(mediaItem => <MediaListItem key={mediaItem.id} mediaItem={mediaItem} />) */}
    {/* <Link to={`/${langId}/media/new`}>+ Add media item</Link> */}
    {/* <Radio /> */}
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
