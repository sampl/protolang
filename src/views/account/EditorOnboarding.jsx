import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { logError } from '../../_util/error.js'
import UserName from '../settings/UserName.jsx'
import { OneCol } from '@/styles/Layout.jsx'

export default () => {

  const [saving, setSaving] = useState(false)

  const { user } = useUser()

  async function onSubmit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      if (!user) return

      const newData = {
        preferences: {
          hasAgreedToEditorTerms: true,
          ...user.preferences,
        },
      }

      const { error } = await supabase
        .from('user_settings')
        .update(newData)
        .eq('created_by', user.id)

      if (error) {
        throw error
      }

      // Force reload the page so this page doesn't show up again
      location.reload()
    } catch (error) {
      logError('save your editor agreement', error)
    } finally {
      setSaving(false)
    }
  }

  const disabled = !user?.username || saving

  return <OneCol>
    <h1>Just a couple small things...</h1>

    <p>Before you edit anything, please look at the licenses we use on our <Link to="/open-source">open source page</Link> and <Link to="/terms">terms of service</Link>.</p>

    <ul>
      <li>
        <strong>Any content you contribute to Protolang is automatically licensed under our free content licenses</strong>, which means it will always be free for others to download and share.
      </li>
      <li>
        Never add someone else's content unless it has a permissive Creative Commons license or equivalent.
      </li>
      <li>
        If you do add someone else's open content, <em>always</em> cite the author, source, and license at the bottom of the page (regardless of whether the license requires attribution).
      </li>
    </ul>

    <p>Please also review our <Link to="/conduct">code of conduct</Link>.</p>

    <p>And one last thing: choose or confirm your username (you can always change this later)</p>
    <UserName refreshOnSet />
    <br />

    <p>That's it! We're super excited to have you build our courses with us 😁</p>

    <hr />

    <form onSubmit={onSubmit}>
      <button
        className="button"
        disabled={disabled}
        type="submit"
      >
        {saving ? "Saving..." : "I agree"}
      </button>
    </form>
  </OneCol>
}
