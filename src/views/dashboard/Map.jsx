import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()

  return <div>
    <a href="https://en.wikipedia.org/wiki/Italy" target="_blank">
      <img src={`/images/maps/${currentLanguage.id}.png`} style={{ maxWidth: '120px'}} />
    </a>
    <br />
    <a href="https://en.wikipedia.org/wiki/Italy" target="_blank">Italy on Wikipedia →</a>
    <br />
    <br />
  </div>

}
