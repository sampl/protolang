import {useState} from "react"

const NUM_ADULTS = 1
const NUM_CHILDREN = 0
const MONTHS_AHEAD = 3

export default () => {
  const [origin, setOrigin] = useState("NYC")
  const [destination, setDestination] = useState("Rome")

  // https://stackoverflow.com/a/7937257/1061063
  let date = new Date()
  date.setMonth(date.getMonth() + MONTHS_AHEAD + 1)

  // https://stackoverflow.com/a/17306966/1061063
  const year = date.getFullYear().toString().substr(-2)

  // https://stackoverflow.com/a/10073788/1061063
  const month = String(date.getMonth()).padStart(2, '0')

  const url = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/?adultsv2=${NUM_ADULTS}&cabinclass=economy&childrenv2=${NUM_CHILDREN}&ref=home&is_banana_refferal=true&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&oym=${year}${month}&selectedoday=01`

  return <>
    <form>
      Your home airport:
      <br />
      <input name="origin" value={origin} placeholder="NYC" onChange={e => setOrigin(e.target.value)} required />
      <br />
      Destination airport:
      <br />
      <input name="destination" value={destination} onChange={e => setDestination(e.target.value)} />
      <br />
      <a href={url} target="_blank">Find flights</a>
    </form>
  </>
}
