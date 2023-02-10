import React, { useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { useUser } from "../../_state/user"
import Modal from '@/styles/Modal'

// https://formspree.io/forms/xnqyjjgl/integration
// https://formspr.ee/react-help
function FeedbackForm() {

  const { user } = useUser()

  const [isGivingFeedback, setIsGivingFeedback] = useState(false)
  const [state, handleSubmit] = useForm("xnqyjjgl")

  return <>
    <button onClick={() => setIsGivingFeedback(true)}>Feedback</button>

    <Modal isOpen={isGivingFeedback} onClose={() => setIsGivingFeedback(false)}>

      {state.succeeded && <p>Thanks for your feedback!</p>}
      {state.errors && <p>{state.errors[0]?.message}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email" 
          name="email"
          placeholder="your@email.com"
          defaultValue={user?.email || ''}
          disabled={user && user.email || state.submitting || state.succeeded}
          required
          style={{width: '100%'}}
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
          disabled={state.submitting || state.succeeded}
          required
        />
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          placeholder="Comments, questions, or feedback"
        />

        <br />

        <button
          type="submit"
          disabled={state.submitting || state.succeeded}
        >
          Send feedback
        </button>
      </form>

    </Modal>
  </>
}

export default FeedbackForm
