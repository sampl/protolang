export default ({ submitAnswer, disabled }) => {

  const onSubmit = event => {
    event.preventDefault()
    submitAnswer(event.currentTarget.answer.value)
  }

  return <>
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
