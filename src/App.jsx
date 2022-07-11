import Layout from "./Layout"
import { useUser } from "./user";

function App() {
  const { user } = useUser();

  return (
    <Layout>
      hi
      <pre>{JSON.stringify(user)}</pre>
    </Layout>
  )
}

export default App
