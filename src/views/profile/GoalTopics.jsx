import { useEffect, useState } from 'react'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { logError } from '../../_util/error.js'
import { useLanguage } from '@/_state/language.jsx'
import { CheckboxGroup } from '@/styles/RadioCheckbox.jsx'
import Modal from '@/styles/Modal'

export default () => {
  const { currentUserLanguage } = useLanguage()

  const oldTopics = currentUserLanguage?.preferences?.topics
  console.log('currentUserLanguage?.preferences', currentUserLanguage?.preferences)

  const [newTopics, setTopics] = useState(oldTopics)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const topicsQuery = supabase
    .from('topics')
    // .eq('user_selectable', true)
    .select()
  const [topicsList, topicsLoading, topicsError] = useSupabaseQuery(topicsQuery)

  let topicOptions = []
  if (topicsList) {
    topicOptions = topicsList.filter(topic => topic.user_selectable)
      .map(topic => ({
        id: topic.slug,
        description: `${topic.title_eng} - ${topic.description_eng}`,
      }))
  }

  useEffect(() => {
    setTopics(oldTopics)
  }, [oldTopics])

  const onSubmit = async event => {
    event && event.preventDefault()
    try {
      setSaving(true)
      const updates = {
        preferences: {
          ...currentUserLanguage.preferences,
          topics: newTopics,
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
      logError('update topics', error)
    } finally {
      setSaving(false)
      setIsEditing(false)
    }
  }

  return <>
    <p>Areas of interest</p>
    { (oldTopics && oldTopics.length > 0) ? oldTopics.join(', ') : 'No topics set'}

    <br />

    <button type="button" onClick={() => setIsEditing(true)}>Edit</button>

    <Modal
      title="Areas of interest"
      isOpen={isEditing}
      onClose={() => setIsEditing(false)}
    >

      <form onSubmit={onSubmit}>
        <label htmlFor="topics">Choose topics</label>
        <CheckboxGroup
          disabled={topicsLoading || topicsError}
          groupName="topics"
          values={newTopics}
          setValues={setTopics}
          options={topicOptions}
        />

        <hr />

        <button
          className="button"
          type="submit"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save topics'}
        </button>
      </form>

    </Modal>

  </>
}
