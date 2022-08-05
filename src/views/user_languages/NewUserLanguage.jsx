import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { useLanguage } from '@/_state/language'
import { RadioRoot, RadioItem, RadioIndicator } from '@/styles/Radio'

export default ({ closeModal }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { allLanguages, setCurrentLanguageId } = useLanguage()

  const liveLanguages = allLanguages?.filter(l => l.is_live)
  const soonLanguages = allLanguages?.filter(l => !l.is_live)

  const [selectedLanguage, setSelectedLanguage] = useState('lang_it')
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
      closeModal && closeModal()
      setCurrentLanguageId(selectedLanguage)
      navigate('/lessons')
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setSelectedLanguage(undefined)
    }
  }

  console.log(selectedLanguage)

  return <form onSubmit={addUserLanguage}>
    <h2>Choose your language</h2>
    {/* <select
      value={selectedLanguage}
      onChange={e => setSelectedLanguage(e.target.value)}
      required
      >
      <option>-- Choose a language --</option>
      {allLanguages?.map(lang => {
        return <option key={lang.id} value={lang.id}>{lang.name_en} {!lang.is_live && '(Coming soon)'}</option>
      })}
    </select> */}

    <RadioRoot
      value={selectedLanguage}
      onValueChange={value => setSelectedLanguage(value)}
      required
    >
      {liveLanguages?.map(lang => {
        return <RadioItem
          key={lang.id}
          value={lang.id}
        >
          <RadioIndicator />
          {lang.name_en}
        </RadioItem>
      })}

      <h3>Coming soon...</h3>

      {soonLanguages?.map(lang => {
        return <RadioItem
        key={lang.id}
        value={lang.id}
        >
          <RadioIndicator />
          {lang.name_en}
        </RadioItem>
      })}

    </RadioRoot>

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Getting ready...' : 'Start learning'}
    </button>

  </form>
}
