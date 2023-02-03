import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { useLanguage } from '@/_state/language'
import { RadioRoot, RadioItem, RadioIndicator } from '@/styles/Radio'
import { Button } from '@/styles/Button'

export default ({ closeModal }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [selectedGoal, setSelectedGoal] = useState()
  const [selectedVisitPlans, setSelectedVisitPlans] = useState()
  const [selectedVisitDate, setSelectedVisitDate] = useState()
  const [selectedSkill, setSelectedSkill] = useState()
  // const [extroversion, setExtroversion] = useState()
  // const [conversationMedium, setConversationMedium] = useState()
  // const [mediaTypes, setMediaTypes] = useState()
  // const [socialNetworks, setSocialNetworks] = useState()
  // const [emailUpdates, setEmailUpdates] = useState()
  const [saving, setSaving] = useState(false)

  async function addUserLanguage( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        created_by: user?.id,
        language: currentLanguage.id,
        goal: selectedGoal,
        visit_plans: selectedVisitPlans,
        visit_date: selectedVisitDate,
        self_reported_skill: selectedSkill,
        // extroversion: extroversion,
        // conversation_medium: conversationMedium,
        // media_types: mediaTypes,
        // social_media_networks: socialNetworks,
        // email_updates: emailUpdates
      }
      if (user) {
        let { error } = await supabase.from('user_languages').insert([newData])
        if (error) {
          throw error
        }
      }
      closeModal && closeModal()
      navigate('/lessons')
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  return <form onSubmit={addUserLanguage}>

    <h2>Language goals</h2>
    <p>We'll use your answer to set up some casual learning milestones</p>

    {/* spellchecker: disable */}
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
        Sì, I know a little bit
      </RadioItem>
      <RadioItem value="lots">
        <RadioIndicator />
        In realtà parlo un ottimo italiano
      </RadioItem>
    </RadioRoot>
    {/* spell-checker: enable */}

    <label>How serious are you about learning {currentLanguage?.name_en || 'this language'}?</label>
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

    <hr />

    <h2>Travel plans</h2>
    <p>This will help us set your learning pace</p>

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

    {selectedVisitPlans === 'yes_date' && <>
      <label>When is your trip?</label>
      <input
        type="date"
        onChange={e => setSelectedVisitDate(e.target.value)}
      />
    </>}

    {/*

    // TODO - checkbox so they can pick multiple options!

    <hr />

    <h2>Conversation style</h2>
    <p>Helps us decide when and how to match you to a conversation partner</p>

    <label>How comfortable are you chatting with strangers?</label>
    <RadioRoot
      value={extroversion}
      onValueChange={value => setExtroversion(value)}
      required
    >
      <RadioItem value="extroverted">
        <RadioIndicator />
        I love talking to strangers! Match me right away!
      </RadioItem>
      <RadioItem value="moderate">
        <RadioIndicator />
        I'm a little hestitant, but I'm open to trying it soon
      </RadioItem>
      <RadioItem value="introverted">
        <RadioIndicator />
        Pretty unfomfortable, let's hold off for now
      </RadioItem>
    </RadioRoot>

    <label>Are you more of a phone call or a texting person for long chats?</label>
    <RadioRoot
      value={conversationMedium}
      onValueChange={value => setConversationMedium(value)}
      required
    >
      <RadioItem value="talker">
        <RadioIndicator />
        I prefer long conversations over the phone
      </RadioItem>
      <RadioItem value="texter">
        <RadioIndicator />
        I prefer long conversations over text
      </RadioItem>
      <RadioItem value="both">
        <RadioIndicator />
        I like both!
      </RadioItem>
      <RadioItem value="neither">
        <RadioIndicator />
        I don't like either, really
      </RadioItem>
    </RadioRoot>

    <hr />

    <h2>Media preferences</h2>
    <p>We'll recommend some Italian media to help you get immersed quickly</p>

    <label>What kind of media do you use throughout the day?</label>
    <RadioRoot
      value={mediaTypes}
      onValueChange={value => setMediaTypes(value)}
      required
    >
      <RadioItem value="articles">
        <RadioIndicator />
        I read a lot of articles (magazines, newspapers, online, etc)
      </RadioItem>
      <RadioItem value="books">
        <RadioIndicator />
        I read a lot of books
      </RadioItem>
      <RadioItem value="audiobooks">
        <RadioIndicator />
        I listen to a lot of audiobooks
      </RadioItem>
      <RadioItem value="podcasts">
        <RadioIndicator />
        I listen to a lot of podcasts
      </RadioItem>
      <RadioItem value="film">
        <RadioIndicator />
        I watch a lot of movies/films
      </RadioItem>
      <RadioItem value="long_video">
        <RadioIndicator />
        I watch a lot of youtube and longer videos
      </RadioItem>
      <RadioItem value="short_video">
        <RadioIndicator />
        I watch a lot of short videos (tiktok, stories, etc)
      </RadioItem>
      <RadioItem value="social_media">
        <RadioIndicator />
        I browse social media feeds a lot (Twitter, Facebook, etc)
      </RadioItem>
      <RadioItem value="games">
        <RadioIndicator />
        I play a lot of video games
      </RadioItem>
      <RadioItem value="none">
        <RadioIndicator />
        None of these, really
      </RadioItem>
    </RadioRoot>

    <label>Do you use social media? If so, which apps?</label>
    <RadioRoot
      value={socialNetworks}
      onValueChange={value => setSocialNetworks(value)}
      required
    >
      <RadioItem value="tiktok">
        <RadioIndicator />
        TikTok
      </RadioItem>
      <RadioItem value="youtube">
        <RadioIndicator />
        YouTube
      </RadioItem>
      <RadioItem value="instagram">
        <RadioIndicator />
        Instagram
      </RadioItem>
      <RadioItem value="snapchat">
        <RadioIndicator />
        Snapchat
      </RadioItem>
      <RadioItem value="twitter">
        <RadioIndicator />
        Twitter
      </RadioItem>
      <RadioItem value="facebook">
        <RadioIndicator />
        Facebook
      </RadioItem>
      <RadioItem value="none">
        <RadioIndicator />
        None of these, really
      </RadioItem>
    </RadioRoot>

    <hr />

    <h2>Italian updates</h2>

    <label>Which email summaries would you like?</label>
    <p>Weekly email updates will fill you in on Italian culture. We recommend choosing at least 2-3 to hit your learning goals (you can unsubscribe anythime).</p>

    <RadioRoot
      value={emailUpdates}
      onValueChange={value => setEmailUpdates(value)}
      required
    >
      <RadioItem value="pop_culture">
        <RadioIndicator />
        Italian pop culture and celebrities
      </RadioItem>
      <RadioItem value="politics">
        <RadioIndicator />
        Italian and European Union politics
      </RadioItem>
      <RadioItem value="sports">
        <RadioIndicator />
        Italian sports (mostly soccer)
      </RadioItem>
      <RadioItem value="history">
        <RadioIndicator />
        Italian history, including Rome and the Renaissance
      </RadioItem>
      <RadioItem value="arts">
        <RadioIndicator />
        Italian current arts, culture, and music
      </RadioItem>
      <RadioItem value="food">
        <RadioIndicator />
        Italian food and restaurants
      </RadioItem>
      <RadioItem value="parties">
        <RadioIndicator />
        Italian events and nightlife
      </RadioItem>
      <RadioItem value="none">
        <RadioIndicator />
        Don't send me any updates for now
      </RadioItem>
    </RadioRoot> */}

    <br />

    <Button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Getting ready...' : 'Start learning'}
    </Button>

  </form>
}
