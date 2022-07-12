import Layout from '@/_layout/Layout'
import { useUser } from '@/_state/user'

export default function Home() {
  const { user } = useUser()

  return (
    <Layout>
      hi
      <pre>{JSON.stringify(user)}</pre>
    </Layout>
  )
}
