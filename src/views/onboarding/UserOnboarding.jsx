import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'
import { RadioGroup, CheckboxGroup } from '@/styles/RadioCheckbox'
import { logError } from '../../_util/error.js'

export default ({ closeModal }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [genderPreference, setGenderPreference] = useState()
  const [languagesYouSpeak, setLanguagesYouSpeak] = useState([])
  const [saving, setSaving] = useState(false)

  const languagesQuery = supabase
    .from('languages')
    .select()
  const [languages, languagesLoading, languagesError] = useSupabaseQuery(languagesQuery)

  async function addUserLanguage( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      if (!user) return

      const newData = {
        id: user.id,
        preferences: {
          gender: genderPreference,
          languages: languagesYouSpeak,
        },
        created_by: user.id,
      }

      const { error } = await supabase
        .from('users')
        .upsert(newData)
        .eq('created_by', user.id)
        .select()

      if (error) {
        throw error
      }
      closeModal && closeModal()
      navigate(`/${currentLanguage.id}`)

      // navigation isn't enough because we're already on that page
      // and user_languages, which we use to decide whether to show onboarding or not,
      // is not real-time updated. So instead we force reload the page.
      // TODO - a better way to do this
      location.reload()
    } catch (error) {
      logError('create user preferences', error)
    } finally {
      setSaving(false)
    }
  }


  // should never happen, but just in case
  if (!user) return 'Error showing user onboarding - no user found.'

  const languageOptionsSimple = !languages ? [] : languages.map(language => ({id: language.id, description: language.name_eng, }))
  const languageOptions = [...languageOptionsSimple, {id: 'other', description: 'Other'}]

  // TODO - username, timezone

  return <form onSubmit={addUserLanguage}>

    <h1>Welcome to Protolang</h1>

    <h2>Personal details</h2>
    <p>This info helps our AI chatbot speak to you with the correct grammar.</p>

    <label>Refer to me as a...</label>
    <RadioGroup
      value={genderPreference}
      setValue={setGenderPreference}
      options={[
        {
          id: "female",
          description: "Woman (feminine)",
        },
        {
          id: "male",
          description: "Man (masculine)",
        },
      ]}
    />
    <p>(Words in some languages are different depending on your gender. You can always change this later.)</p>

    <h2>Languages</h2>

    <label>What languages do you already speak?</label>
    <CheckboxGroup
      disabled={languagesLoading || languagesError}
      groupName="languagesYouSpeak"
      values={languagesYouSpeak}
      setValues={setLanguagesYouSpeak}
      options={languageOptions}
    />
    <p>We'll use this to help you find useful cognates, and may contact you about helping us develop new courses (unsubscribe anytime).</p>

    <br />

    <button
      className="button"
      type="submit"
      disabled={saving}
    >
      {saving ? 'Getting ready...' : 'Start learning'}
    </button>

  </form>
}
