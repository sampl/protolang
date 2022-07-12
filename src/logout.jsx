import Layout from './Layout'
import { useUser } from "./user";
import { useEffect } from 'react';

export default function Logout() {
  const { logout } = useUser();

  useEffect( () => {
    logout()
  }, [])

  return <Layout>
    logging out...
  </Layout>
}
