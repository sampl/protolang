import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { useLanguage } from '@/_state/language'

export default ({ closeModal }) => {
  const { user } = useUser()
  const { allLanguages, setCurrentLanguageId } = useLanguage()
  let navigate = useNavigate()

  const [selectedLanguage, setSelectedLanguage] = useState()
  const [saving, setSaving] = useState(false)

  async function addUserLanguage( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        created_by: user.id,
        language: selectedLanguage,
      }
      let { error } = await supabase.from('user_languages').insert([newData])
      if (error) {
        throw error
      }
      closeModal()
      setCurrentLanguageId(selectedLanguage)
      navigate('/lessons')
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setSelectedLanguage(undefined)
    }
  }

  return <form onSubmit={addUserLanguage}>

    <select
      value={selectedLanguage}
      onChange={e => setSelectedLanguage(e.target.value)}
      required
    >
      <option>-- Choose a language --</option>
      {allLanguages.map(lang => {
        return <option key={lang.id} value={lang.id}>{lang.name_en} {!lang.is_live && '(Coming soon)'}</option>
      })}
    </select>

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Getting ready...' : 'Start learning'}
    </button>

  </form>
}
