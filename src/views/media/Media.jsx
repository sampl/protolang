import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()
  const { lang: urlLang } = useParams()

  let query = supabase
    .from('media')
    .select()
    .eq('language', currentLanguage.id)
  const [media, loading, error] = useSupabaseQuery(query, [currentLanguage.id])

  return <>
    <h1>Media</h1>
    <Link to={`/${urlLang}/media/new`}>+ Add media item</Link>

    <hr />

    {
      error ? error.message :
      loading ? 'loading...' :
      (!media || media.length <= 0) ? 'no media' :
      media.map(mediaItem => <ResourceListItem key={mediaItem.id} mediaItem={mediaItem} />)
    }
  </>
}

const ResourceListItem = ({mediaItem}) => {
  const { lang: urlLang } = useParams()

  return <div>
    <Link to={`/${urlLang}/media/${mediaItem.id}`}>
      {mediaItem.url || 'Unknown url'}
    </Link>
  </div>
}
