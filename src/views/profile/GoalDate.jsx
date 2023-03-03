import { useEffect, useState } from 'react'
import moment from 'moment'

import { supabase } from '@/db/supabase'
import { logError } from '../../_util/error.js'
import { useLanguage } from '@/_state/language.jsx'

export default () => {
  const { currentUserLanguage } = useLanguage()

  const oldVisitDate = currentUserLanguage?.preferences?.visit_date
  console.log('currentUserLanguage?.preferences', currentUserLanguage?.preferences)

  const [visitDate, setVisitDate] = useState(oldVisitDate)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setVisitDate(oldVisitDate)
  }, [oldVisitDate])

  // TODO - nuke this and get rid of preferences json?

  const onSubmit = async event => {
    event && event.preventDefault()
    try {
      setLoading(true)
      const updates = {
        preferences: {
          ...currentUserLanguage.preferences,
          visit_date: moment(visitDate).format(),
        },
      }

      const { error } = await supabase
        .from('user_languages')
        .update([updates])
        .eq('id', currentUserLanguage.id)

      if (error) {
        throw error
      }
      location.reload()
    } catch (error) {
      logError('update visit date', error)
    } finally {
      setLoading(false)
      setIsEditing(false)
    }
  }

  // debugger

  return <>
    { oldVisitDate ? `${moment(oldVisitDate).diff(moment().format(), "weeks")} weeks left` : 'No visit date set'}
    <br />
    {
      !isEditing ?
      <button onClick={event => {
        event.preventDefault()
        setIsEditing(true)
      }}>
        {visitDate ? 'Edit date' : 'Set date'}
      </button>
      :
      <form onSubmit={onSubmit}>
        <input
          id="visitDate"
          type="date"
          value={visitDate ? moment(visitDate).format('yyyy-MM-DD') : ''}
          onChange={(e) => setVisitDate(e.target.value)}
        />
        <button className="button" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
        <button className="button" type="button" disabled={loading} onClick={() => setIsEditing(false)}>Cancel</button>
        <button className="button" type="button" disabled={loading} onClick={() => {
          setVisitDate(null)
          // onSubmit()
        }}>Clear</button>
      </form>
    }
  </>
}
