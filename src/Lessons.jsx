import Layout from './Layout'
import { Link } from 'react-router-dom';
import { useSelect } from 'react-supabase';

export default function Lessons() {

  const [{ data: lessons, error, fetching }] = useSelect('lessons')

  return <Layout>
    <h1>Lessons</h1>
    {error && error.message}
    {fetching && 'loading...'}
    {
      (!lessons || lessons.length <= 0)
      ?
      'no lessons'
      :
      lessons.map(lesson => <LessonListItem key={lesson.id} lesson={lesson} />)
    }
  </Layout>
}

const LessonListItem = ({lesson}) => {
  return <Link to={`/lessons/${lesson.id}`}>
    {lesson.title_en || 'Unknown'}
  </Link>
}
