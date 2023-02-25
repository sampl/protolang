import styled from 'styled-components/macro'

export default ({ youtubeUrl, onNext, onPrev }) => {

  let url = youtubeUrl
  if (url) {
    // https://developers.google.com/youtube/player_parameters
    url += '?autoplay=1'
    url += '&cc_load_policy=1'
    url += '&cc_lang_pref=it'
    url += '&color=white'
    url += '&controls=0'
    url += '&hl=it'
    url += '&modestbranding=1'
  }

  return <Room>
    <Tv>
      <TvBody>
        <ScreenWrapper>
          <Screen>
            {url && <Frame
              src={url}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />}
          </Screen>
        </ScreenWrapper>
        <SidePanel>
          <Knobs>
            <Knob onClick={onNext}>←</Knob>
            <Knob onClick={onPrev}>→</Knob>
          </Knobs>
          <Speaker />
      </SidePanel>
      </TvBody>
      <Feet>
        <Foot />
        <Foot />
      </Feet>
    </Tv>
    <Table />
  </Room>
}

const Room = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 100vh;
  padding: 3vw;
`
const Table = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  border-top: 1px solid;
  border-bottom: 1px solid;
`
const Tv = styled.div`
  width: 100%;
  max-width: 1200px;
  border-radius: 100px;
  padding: 5%;
  display: flex;
  flex-direction: column;
  z-index: 1;
`
const TvBody = styled.div`
  background: white;
  border: 1px solid;
  border-radius: 30px;
  padding: 5%;
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 5%;
`
const SidePanel = styled.div`
  display: grid;
  grid-template-rows: max-content auto;
  gap: 5%;
`
const Speaker = styled.div`
  background: white;
  background-image: url(/images/dots.svg);
  background-size: 100%;
`
const Knobs = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  /* justify-content: space-between; */
  gap: 10%;
`
const Knob = styled.button`
  background: white;
  border: 1px solid;
  padding: 20%;
  box-shadow: 2px 2px;

  &:active {
    box-shadow: none;
    transform: translate(2px, 2px);
  }
`
const ScreenWrapper = styled.div`
  border-radius: 5%;
  background: #333;
  padding: 5%;
`
const Screen = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 4/3;
  background: #000;
  /* border-radius: 10%; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`
const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  margin: -5px;
  border: none;
  /* aspect-ratio: 16/9; */
`
const Feet = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const Foot = styled.div`
  height: 4px;
  width: 3vw;
  background: #333;
  border-radius: 0 0 100px 100px;
  margin: 0 10%;
`
