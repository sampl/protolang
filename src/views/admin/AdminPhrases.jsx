// import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import SpeakWord from '@/views/dictionary/SpeakWord'
import PhraseNew from '../practice/PhraseNew'
// import ReportIssue from '@/views/practice/ReportIssue'

export default () => {
  const { langId } = useParams()

  // const [isReportingError, setIsReportingError] = useState(false)

  const query = supabase
    .from('phrases')
    .select()
    .eq('language_id', langId)
  const [phrases, loading, error] = useSupabaseQuery(query, [langId])

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!phrases || phrases.length <= 0) return <div>no phrases</div>

  // const deletePhrase = async (phraseId) => {
  //   if (!window.confirm('Are you sure you want to delete this phrase?')) return
  //   const { error } = await supabase
  //     .from('phrases')
  //     .update({ deleted_at: new Date() })
  //     .eq('id', phraseId)
  //   debugger
  //   if (error) alert(error.message)
  // }

  return <>
    <h1>Phrases</h1>
    {phrases.length} phrase{phrases.length === 1 ? '' : 's'}
    <PhraseNew />

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th></th>
          <th>Italian</th>
          <th>English</th>
          <th>Created by</th>
          <th>Created at</th>
          <th>Last updated</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          phrases.map(phrase => {
            return <tr key={phrase.id}>
              <td>
                {phrase.id}
              </td>
              <td>
                <SpeakWord wordString={phrase.content_it} />
              </td>
              <td>
                {phrase.content_it}
              </td>
              <td>
                {phrase.content_en}
              </td>
              <td>
                {phrase.created_by}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(phrase.created_at))}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(phrase.updated_at))}
              </td>
              <td>
                <Link to={`/${langId}/practice/${phrase.id}/edit`}>
                  Edit
                </Link>
              </td>
              <td>
                <Link to={`/${langId}/practice/${phrase.id}`}>
                  View
                </Link>
              </td>
              {/* <td>
                <button onClick={() => deletePhrase(phrase.id)}>
                  🗑️
                </button>
              </td> */}
              {/* <td>
                <button onClick={() => setIsReportingError(true)}>Report error</button>
                {
                  isReportingError && 
                  <ReportIssue phrase={phrase} close={() => setIsReportingError(false)} />
                }
              </td> */}
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
