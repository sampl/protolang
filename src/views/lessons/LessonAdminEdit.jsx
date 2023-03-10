import { useState } from 'react'

import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'

export default ({ lesson }) => {

  const [lessonAdminEditorIsOpen, setAdminLessonEditorIsOpen] = useState(false)
  const [titleEng, setTitleEng] = useState(lesson.title_eng || '')
  const [titleIta, setTitleIta] = useState(lesson.title_ita || '')
  const [unit, setUnit] = useState(lesson.unit || 0)
  const [sortOrder, setSortOrder] = useState(lesson.sort_order || 0)
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        title_eng: titleEng,
        title_ita: titleIta,
        unit,
        sort_order: sortOrder,
      }

      const { error } = await supabase
        .from('lessons')
        .update(newData)
        .eq('id', lesson.id)

      if (error) {
        throw error
      }
      setAdminLessonEditorIsOpen(false)
    } catch (error) {
      setSaving(false)
      logError('edit admin lesson', error)
    }
  }

  return <>
    <button type="button" onClick={() => setAdminLessonEditorIsOpen(true)}>Admin</button>

    <Modal
      title="Edit lesson"
      isOpen={lessonAdminEditorIsOpen}
      onClose={() => setAdminLessonEditorIsOpen(false)}
    >
      <form onSubmit={submit} key={lesson.id}>
        <label htmlFor="titleEng">Title</label>
        <input
          id="titleEng"
          type="text"
          value={titleEng}
          placeholder=""
          onChange={e => setTitleEng(e.target.value)}
          required
        />

        <label htmlFor="titleIta">Italian title (optional)</label>
        <input
          id="titleIta"
          type="text"
          value={titleIta}
          placeholder=""
          onChange={e => setTitleIta(e.target.value)}
          required
        />

        <label htmlFor="sortOrder">Sort order</label>
        <input
          id="sortOrder"
          type="number"
          value={sortOrder}
          placeholder="Sort order"
          onChange={e => setSortOrder(e.target.value)}
          required
        />

        <label htmlFor="unit">Unit</label>
        <input
          id="unit"
          type="number"
          value={unit}
          placeholder="Unit"
          onChange={e => setUnit(e.target.value)}
          required
        />

        <hr />

        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save lesson'}
        </button>
      </form>
    </Modal>
  </>
}
