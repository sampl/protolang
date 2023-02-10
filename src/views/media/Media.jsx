import { useSelect, useFilter } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()
  const { lang: urlLang } = useParams()

  const [{ data: media, error, fetching }] = useSelect('media', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    )
  })

  return <>
    <h1>Media</h1>
    <Link to={`/${urlLang}/media/new`}>+ Add media item</Link>

    <hr />

    {
      error ? error.message :
      fetching ? 'loading...' :
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
