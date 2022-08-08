export default ({ youtubeId }) => {
  return <iframe
    src={`https://www.youtube.com/embed/${youtubeId}`}
    width="400"
    height="260"
    style={{border: 'none'}}
  />
}
