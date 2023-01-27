import React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { useUser } from "../../_state/user"

// https://formspree.io/forms/xnqyjjgl/integration
// https://formspr.ee/react-help
function FeedbackForm() {
  const [state, handleSubmit] = useForm("xnqyjjgl")
  const { user } = useUser()

  if (state.succeeded) {
    return <p>Thanks for your feedback!</p>
  }

  return <form onSubmit={handleSubmit}>
    <label htmlFor="email">
      Email address
    </label>
    <input
      id="email"
      type="email" 
      name="email"
      placeholder="your@email.com"
      value={user && user.email}
      disabled={user && user.email}
      />
    <ValidationError 
      prefix="Email" 
      field="email"
      errors={state.errors}
      />
    
    <br />

    <label htmlFor="message">
      Message
    </label>
    <textarea
      id="message"
      name="message"
    />
    <ValidationError 
      prefix="Message" 
      field="message"
      errors={state.errors}
      placeholder="Comments, questions, or feedback"
    />

    <br />

    <button type="submit" disabled={state.submitting}>
      Send feedback
    </button>
  </form>
}

export default FeedbackForm
