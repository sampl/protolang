import { Link } from "react-router-dom";

export default ({ card }) => {
  return <div>
    <h4>{card && card.word.translation_en}</h4>
    <Link to={`/words/${card.word.id}`}>go to word</Link>
  </div>
}
