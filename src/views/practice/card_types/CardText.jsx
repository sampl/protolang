export default ({ word, answer, cardState }) => {

  const onSubmit = event => {
    event.preventDefault()
    answer(event.currentTarget.answer.value)
  }

  const disabled = cardState === 'correct' || cardState === 'incorrect'

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
