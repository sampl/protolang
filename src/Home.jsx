import Layout from "./Layout"
import { useUser } from "./user";

export default function Home() {
  const { user } = useUser();

  return (
    <Layout>
      hi
      <pre>{JSON.stringify(user)}</pre>
    </Layout>
  )
}
