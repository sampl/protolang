import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'
import { Button } from '@/styles/Button'
import { RadioGroup, CheckboxGroup } from '@/styles/RadioCheckbox'

export default ({ closeModal }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [selectedGoal, setSelectedGoal] = useState()
  const [selectedVisitPlans, setSelectedVisitPlans] = useState()
  const [selectedVisitDate, setSelectedVisitDate] = useState()
  const [selectedSkill, setSelectedSkill] = useState()
  const [extroversion, setExtroversion] = useState()
  // const [conversationMedium, setConversationMedium] = useState()
  // const [mediaTypes, setMediaTypes] = useState([])
  // const [socialNetworks, setSocialNetworks] = useState([])
  // const [emailUpdates, setEmailUpdates] = useState([])
  const [topics, setTopics] = useState([])
  const [saving, setSaving] = useState(false)

  const topicsQuery = supabase
    .from('topics')
    // .eq('user_selectable', true)
    .select()
  const [topicsList, topicsLoading, topicsError] = useSupabaseQuery(topicsQuery)

  async function addUserLanguage( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        language_id: currentLanguage.id,
        preferences: {
          goal: selectedGoal,
          visit_plans: selectedVisitPlans,
          visit_date: selectedVisitDate,
          self_reported_skill: selectedSkill,
          extroversion: extroversion,
          // conversation_medium: conversationMedium,
          // media_types: mediaTypes,
          // social_media_networks: socialNetworks,
          // email_updates: emailUpdates,
          topics: topics,
        },
        created_by: user?.id,
      }
      if (user) {
        const { error } = await supabase
          .from('user_languages')
          .insert([newData])
        if (error) {
          throw error
        }
      }
      closeModal && closeModal()
      navigate(`/${currentLanguage.id}`)

      // navigation isn't enough because we're already on that page
      // and user_languages, which we use to decide whether to show onboarding or not,
      // is not real-time updated. So instead we force reload the page.
      // TODO - a better way to do this
      location.reload()
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  let topicOptions = []
  if (topicsList) {
    topicOptions = topicsList.filter(topic => topic.user_selectable)
      .map(topic => ({
        id: topic.id,
        description: `${topic.title_en} - ${topic.description_en}`,
      }))
  }

  return <form onSubmit={addUserLanguage}>

    <h1>{`Getting started in ${currentLanguage.name_en || 'your new language'}`}</h1>
    <h2>Language goals</h2>
    <p>We'll use your answer to set up some casual learning milestones</p>

    <label>Do you already speak some Italian?</label>
    <RadioGroup
      value={selectedSkill}
      setValue={setSelectedSkill}
      options={[
        {
          id: "no",
          description: "Nope",
        },
        {
          id: "some",
          description: "Sì, I know a little bit",
        },
        {
          id: "lots",
          // spellchecker: disable
          description: "In realtà parlo un ottimo italiano",
          // spell-checker: enable
        },
      ]}
    />

    <label>How serious are you about learning {currentLanguage?.name_en || 'this language'}?</label>
    <RadioGroup
      value={selectedGoal}
      setValue={setSelectedGoal}
      options={[
        {
          id: "playing_around",
          description: "Just playing around - hobby (your proficiency score goal is 100 words, enough to impress your friends and basic politeness in Italy)",
        },
        {
          id: "some",
          description: "I want to have some basic conversations - travel coming up, tourists, travelers, (your proficiency score is 1,000 words, enough to have basic conversations in Italian)",
        },
        {
          id: "fluency",
          description: "I want to be fluent in Italian - immigrants, spouses, employees etc (your proficiency goal is 10,000 words, the same as a fluent COFL B2 speaker)",
        },
      ]}
    />


    <h2>Travel plans</h2>
    <p>This will help us set your learning pace</p>

    <label>Do you have plans to visit Italy (or an Italian-speaking part of the world)?</label>
    <RadioGroup
      value={selectedVisitPlans}
      setValue={setSelectedVisitPlans}
      options={[
        {
          id: "yes_date",
          description: "Yes",
        },
        {
          id: "yes_no_date",
          description: "Yes, but no firm dates yet",
        },
        {
          id: "someday",
          description: "I'd love to go someday (or go back someday)",
        },
        {
          id: "none",
          description: "Not really",
        },
      ]}
    />

    {selectedVisitPlans === 'yes_date' && <>
      <label>When is your trip?</label>
      <input
        type="date"
        onChange={e => setSelectedVisitDate(e.target.value)}
      />
    </>}


    <h2>Conversation style</h2>
    <p>Helps us decide when and how to match you to a conversation partner</p>

    <label>How comfortable are you chatting with strangers?</label>
    <RadioGroup
      groupName={extroversion}
      setValue={setExtroversion}
      options={[
        {
          id: "extroverted",
          description: "I love talking to strangers! Match me right away.",
        },
        {
          id: "moderate",
          description: "I'm a little hestitant, but I'm open to trying it soon.",
        },
        {
          id: "introverted",
          description: "Pretty uncomfortable, let's hold off for now.",
        },
      ]}
    />

    {/* <label>Are you more of a phone call or a texting person for long chats?</label>
    <RadioGroup
      value={conversationMedium}
      setValue={setConversationMedium}
      options={[
        {
          id: "talker",
          description: "I prefer long conversations over the phone",
        },
        {
          id: "texter",
          description: "I prefer long conversations over text",
        },
        {
          id: "both",
          description: "I like both",
        },
        {
          id: "neither",
          description: "I don't like either, really",
        },
      ]}
    /> */}


    <h2>Topics</h2>
    <p>Help us focus you on the parts of language you want to learn most</p>

    <label>What kinds of things do you want to talk about in Italian?</label>
    <CheckboxGroup
      disabled={topicsLoading || topicsError}
      groupName="topics"
      values={topics}
      setValues={setTopics}
      options={topicOptions}
    />


    {/* <h2>Media preferences</h2>
    <p>We'll recommend some Italian media to help you get immersed quickly</p>

    <label>What kind of media do you use throughout the day?</label>
    <CheckboxGroup
      groupName="mediaTypes"
      values={mediaTypes}
      setValues={setMediaTypes}
      options={[
        {
          id: "articles",
          description: "I read a lot of articles (magazines, newspapers, online, etc)",
        },
        {
          id: "books",
          description: "I read a lot of books",
        },
        {
          id: "audiobooks",
          description: "I listen to a lot of audiobooks",
        },
        {
          id: "podcasts",
          description: "I listen to a lot of podcasts",
        },
        {
          id: "film",
          description: "I watch a lot of movies/films",
        },
        {
          id: "long_video",
          description: "I watch a lot of youtube and longer videos",
        },
        {
          id: "short_video",
          description: "I watch a lot of short videos (tiktok, stories, etc)",
        },
        {
          id: "social_media",
          description: "I browse social media feeds a lot (Twitter, Facebook, etc)",
        },
        {
          id: "games",
          description: "I play a lot of video games",
        },
        {
          id: "none",
          description: "None of these, really",
        }
      ]}
    />

    <label>Do you use social media? If so, which apps?</label>
    <CheckboxGroup
      groupName="socialNetworks"
      values={socialNetworks}
      setValues={setSocialNetworks}
      options={[
        {
          id: "tiktok",
          description: "TikTok",
        },
        {
          id: "youtube",
          description: "YouTube",
        },
        {
          id: "instagram",
          description: "Instagram",
        },
        {
          id: "snapchat",
          description: "Snapchat",
        },
        {
          id: "twitter",
          description: "Twitter",
        },
        {
          id: "facebook",
          description: "Facebook",
        },
        {
          id: "none",
          description: "None of these, really",
        }
      ]}
    />


    <h2>Italian updates</h2>

    <label>Which email summaries would you like?</label>
    <p>Weekly email updates will fill you in on Italian culture. We recommend choosing at least 2-3 to hit your learning goals (you can unsubscribe anythime).</p>
    <CheckboxGroup
      groupName="emailUpdates"
      values={emailUpdates}
      setValues={setEmailUpdates}
      options={[
        {
          id: "pop_culture",
          description: "Italian pop culture and celebrities",
        },
        {
          id: "politics",
          description: "Italian and European Union politics",
        },
        {
          id: "sports",
          description: "Italian sports (mostly soccer)",
        },
        {
          id: "history",
          description: "Italian history, including Rome and the Renaissance",
        },
        {
          id: "arts",
          description: "Italian current arts, culture, and music",
        },
        {
          id: "food",
          description: "Italian food and restaurants",
        },
        {
          id: "parties",
          description: "Italian events and nightlife",
        },
        {
          id: "none",
          description: "Don't send me any updates for now",
        }
      ]}
    /> */}

    <br />

    <Button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Getting ready...' : 'Start learning'}
    </Button>

  </form>
}
