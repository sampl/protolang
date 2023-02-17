import { Link, useParams } from 'react-router-dom'

import { TwoColumns } from '@/styles/Layout'
import { useUser } from "@/_state/user"
import LayoutLanguage from './LayoutLanguage'

export default ({children}) => {
  const { langId } = useParams()
  const { loading, isAdmin } = useUser()

  if (loading) return 'Loading...'

  if (!isAdmin) {
    return <LayoutLanguage>
      <p>
        Sorry, you have to be an admin to view this page.
      </p>
      <p>
        Are you expecting access?
        <br />
        <Link to={`/contact`}>Contact us</Link>
      </p>
    </LayoutLanguage>
  }

  return <LayoutLanguage>
    <TwoColumns cols="200px auto" gap="2">
      <nav>
        <strong>Admin dashboard</strong>
        <br />
        <Link to={`/${langId}/admin/lessons`}>🧑‍🏫 Lessons</Link>
        <br />
        <Link to={`/${langId}/admin/lesson-edits`}>📝 Lesson edits</Link>
        <br />
        <Link to={`/${langId}/admin/phrases`}>💬 Phrases</Link>
        <br />
        <Link to={`/${langId}/admin/phrase-issues`}>⚠️ Issues</Link>
        <br />
        <Link to={`/${langId}/admin/languages`}>🈸 Languages</Link>
        <br />
        <Link to={`/${langId}/admin/users`}>👤 Users</Link>
      </nav>
      <main>
        {children}
      </main>
    </TwoColumns>
  </LayoutLanguage>
}
