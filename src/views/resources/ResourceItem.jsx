import { useFilter, useSelect } from 'react-supabase'
import { useParams } from 'react-router-dom'

export default () => {
  let { id } = useParams()

  const [{ data, error, fetching }] = useSelect('resources', {
    columns: '*, resource_ratings(*)',
    filter: useFilter(
      (query) => query.eq('id', id),
      [id],
    ),
  })
  
  const resource = data && data[0]

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
      !resource ? 'no resource found' :
      <>
        <h1>{resource.url}</h1>
        {
          (!resource.resource_ratings || resource.resource_ratings.length <= 0) ? 'no ratings' :
          resource.resource_ratings.map(rr => {
            return <div key={rr.id}>{rr.stars} star(s): {rr.content}</div>
          })
        }
      </>
    }
  </>
}
