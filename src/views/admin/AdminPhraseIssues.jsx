import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('phrase_issues')
    .select('*, phrase(*)')
    .eq('language_id', langId)
  const [phraseIssues, loading, error] = useSupabaseQuery(query, [langId])

  const setResolved = async (id, status = true) => {
    const { error } = await supabase
      .from('phrase_issues')
      .update({ is_resolved: status })
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      location.reload()
    }
  }

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!phraseIssues || phraseIssues.length <= 0) return <div>no phrase issues</div>

  return <>
    <h1>Phrase issues</h1>
    {phraseIssues.length} phrase issue{phraseIssues.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Phrase</th>
          <th>Translation</th>
          <th>Comment</th>
          <th>Reporter</th>
          <th>Created at</th>
          <th>Last updated</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          phraseIssues.map(phraseIssue => {
            return <tr key={phraseIssue.id}>
              <td>
                {phraseIssue.id}
              </td>
              <td>
                <Link to={`/${langId}/practice/${phraseIssue.phrase?.id}`}>{phraseIssue.phrase?.content_it}</Link>
              </td>
              <td>
                <span>{phraseIssue.phrase?.content_en}</span>
              </td>
              <td>
                <span>{phraseIssue.comment}</span>
              </td>
              <td>
                {phraseIssue.created_by}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(phraseIssue.created_at))}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(phraseIssue.updated_at))}
              </td>
              <td>
                {phraseIssue.is_resolved ? '✔️' : 'Open'}
              </td>
              <td>
                  {
                    phraseIssue.is_resolved ?
                    <button onClick={() => setResolved(phraseIssue.id, false)}>Reopen</button> : 
                    <button onClick={() => setResolved(phraseIssue.id, true)}>Resolve</button>
                  }
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
