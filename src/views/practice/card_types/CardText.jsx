export default ({ word, submitAnswer, disabled }) => {

  const onSubmit = event => {
    event.preventDefault()
    submitAnswer(event.currentTarget.answer.value)
  }

  return <>
    <p>Type the Italian for...</p>
    <h2>{word?.translation_en}</h2>
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
