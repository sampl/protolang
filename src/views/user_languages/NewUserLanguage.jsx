import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { useLanguage } from '@/_state/language'
import { RadioRoot, RadioItem, RadioIndicator } from '@/styles/Radio'

export default ({ closeModal }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { languages, setCurrentLanguageId } = useLanguage()

  const liveLanguages = languages?.filter(l => l.is_live)
  const soonLanguages = languages?.filter(l => !l.is_live)

  const [selectedLanguage, setSelectedLanguage] = useState()
  const [selectedGoal, setSelectedGoal] = useState()
  const [selectedVisitPlans, setSelectedVisitPlans] = useState()
  const [selectedVisitDate, setSelectedVisitDate] = useState()
  const [selectedSkill, setSelectedSkill] = useState()
  const [saving, setSaving] = useState(false)

  async function addUserLanguage( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        created_by: user?.id,
        language: selectedLanguage,
        goal: selectedGoal,
        visit_plans: selectedVisitPlans,
        visit_date: selectedVisitDate,
        self_reported_skill: selectedSkill,
      }
      if (user) {
        let { error } = await supabase.from('user_languages').insert([newData])
        if (error) {
          throw error
        }
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

  return <form onSubmit={addUserLanguage}>
    <h2>Choose your language</h2>
    {/* <select
      value={selectedLanguage}
      onChange={e => setSelectedLanguage(e.target.value)}
      required
      >
      <option>-- Choose a language --</option>
      {languages?.map(lang => {
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

    <label>How serious are you about learning Italian?</label>
    <RadioRoot
      value={selectedGoal}
      onValueChange={value => setSelectedGoal(value)}
      required
    >
      <RadioItem value="playing_around">
        <RadioIndicator />
        Just playing around - hobby (your proficiency score goal is 100 words, enough to impress your friends and basic politeness in Italy)
      </RadioItem>
      <RadioItem value="some">
        <RadioIndicator />
        I want to have some basic conversations - travel coming up, tourists, travelers, (your proficiency score is 1,000 words, enough to have basic conversations in Italian)
      </RadioItem>
      <RadioItem value="fluency">
        <RadioIndicator />
        I want to be fluent in Italian - immigrants, spouses, employees etc (your proficiency goal is 10,000 words, the same as a fluent COFL B2 speaker)
      </RadioItem>
    </RadioRoot>

    <br />

    <label>Do you have plans to visit Italy (or an Italian-speaking part of the world)?</label>
    <RadioRoot
      value={selectedVisitPlans}
      onValueChange={value => setSelectedVisitPlans(value)}
      required
    >
      <RadioItem value="yes_date">
        <RadioIndicator />
        Yes!
      </RadioItem>
      <RadioItem value="yes_no_date">
        <RadioIndicator />
        Yes, but no firm dates yet
      </RadioItem>
      <RadioItem value="someday">
        <RadioIndicator />
        I'd love to someday!
      </RadioItem>
      <RadioItem value="none">
        <RadioIndicator />
        Not really
      </RadioItem>
    </RadioRoot>

    <br />

    {selectedVisitPlans === 'yes_date' && <>
      <label>When is your trip?</label>
      <input
        type="date"
        onChange={e => setSelectedVisitDate(e.target.value)}
      />
      <br />
    </>}

    <label>Do you already speak some Italian?</label>
    <RadioRoot
      value={selectedSkill}
      onValueChange={value => setSelectedSkill(value)}
      required
    >
      <RadioItem value="no">
        <RadioIndicator />
        Nope!
      </RadioItem>
      <RadioItem value="some">
        <RadioIndicator />
        Sì, I learned a little bit
      </RadioItem>
      <RadioItem value="lots">
        <RadioIndicator />
        In realtà parlo un ottimo italiano
      </RadioItem>
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
