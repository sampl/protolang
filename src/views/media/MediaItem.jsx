import { useFilter, useSelect } from 'react-supabase'
import { useParams } from 'react-router-dom'

export default () => {
  let { id } = useParams()

  const [{ data, error, fetching }] = useSelect('media', {
    columns: '*, media_ratings(*)',
    filter: useFilter(
      (query) => query.eq('id', id),
      [id],
    ),
  })
  
  const media = data && data[0]

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
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
