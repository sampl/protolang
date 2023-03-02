export default ({ wordString }) => {
  
  if (!wordString) {
    return null
  }
  
  const corpusLangCode = 33 // italian
  const wordUrl = wordString.split(' ').join('+')

  return <>
    <h3>Word frequency</h3>

    {/* https://ell.meta.stackexchange.com/questions/4698/how-can-i-insert-a-google-ngram-chart-relatively-easily */}
    <iframe
      src={`https://books.google.com/ngrams/interactive_chart?content=${wordUrl}&corpus=${corpusLangCode}&year_start=1800`}
      width="400"
      height="240"
      hspace="0"
      vspace="0"
      style={{border: 0, maxWidth: '100%'}}
    />

    <p style={{fontSize: 'small'}}>
      More about
      {' '}
      <a
        href={`https://books.google.com/ngrams/info`}
        target="_blank"
      >
        Google Ngram
      </a>
    </p>

  </>
}
