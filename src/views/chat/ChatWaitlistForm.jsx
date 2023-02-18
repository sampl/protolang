import React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { useUser } from "../../_state/user"

// https://formspree.io/forms/xnqyjjgl/integration
// https://formspr.ee/react-help
export default () => {

  const { user } = useUser()

  const [state, handleSubmit] = useForm("xnqyjjgl")

  return <form onSubmit={handleSubmit}>
    {state.succeeded && <p>Thanks for your feedback!</p>}
    {state.errors && <p>{state.errors[0]?.message}</p>}

    <input
      id="email"
      type="email" 
      name="email"
      placeholder="your@email.com"
      defaultValue={user?.email || ''}
      disabled={user && user.email || state.submitting || state.succeeded}
      required
      style={{width: '100%', maxWidth: '260px'}}
    />
    {' '}
    <button type="submit" disabled={state.submitting || state.succeeded}>
      Join waitlist
    </button>

    <ValidationError 
      prefix="Email" 
      field="email"
      errors={state.errors}
    />

  </form>
}
