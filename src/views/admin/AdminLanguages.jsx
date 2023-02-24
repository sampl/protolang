import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {

  const query = supabase
    .from('languages')
    .select('*, language_votes(count)')
  const [languages, loading, error] = useSupabaseQuery(query)

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!languages || languages.length <= 0) return <div>no languages</div>

  return <>
    <h1>Languages</h1>
    {languages.length} language{languages.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Flag</th>
          <th>Name</th>
          <th>Votes</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          languages.map(language => {
            return <tr key={language.id}>
              <td>
                {language.id}
              </td>
              <td>
                {language.flag}
              </td>
              <td>
                {language.name_eng}
              </td>
              <td>
                {language.language_votes && language.language_votes[0].count}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(language.created_at))}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(language.updated_at))}
              </td>
              <td>
                <Link to={`/${language.id}`}>View</Link>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
