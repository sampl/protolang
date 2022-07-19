export default ({ direction, question, submitAnswer, disabled }) => {

  const onSubmit = event => {
    event.preventDefault()
    submitAnswer(event.currentTarget.answer.value)
  }

  return <>
    <p>Type the {direction === 'forward' ? 'Italian' : 'English'} for...</p>
    <h2>{question}</h2>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="answer"
        disabled={disabled}
        autoFocus
        required
      />
      <button type="submit" disabled={disabled}>Submit</button>
    </form>
  </>
}
