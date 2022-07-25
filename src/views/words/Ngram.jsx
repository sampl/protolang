export default ({ word }) => {
  
  if (!word?.name) {
    return null
  }
  
  const corpusLangCode = 33 // italian
  const wordUrl = word.name.split(' ').join('+')

  return <>
    <h3>Word frequency</h3>
    <p>
      More about
      {' '}
      <a
        href={`https://books.google.com/ngrams/info`}
        target="_blank"
      >
        Google Ngram
      </a>
    </p>

    {/* https://ell.meta.stackexchange.com/questions/4698/how-can-i-insert-a-google-ngram-chart-relatively-easily */}
    <iframe
      src={`https://books.google.com/ngrams/interactive_chart?content=${wordUrl}&corpus=${corpusLangCode}&year_start=1800`}
      width="740"
      height="340"
      marginWidth="0"
      marginHeight="0"
      hspace="0"
      vspace="0"
      frameBorder="0"
      scrolling="no"
    />

  </>
}
