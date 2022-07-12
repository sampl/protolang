import { useSelect } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'

export default function AccountDropdown() {

  const { user } = useUser()

  // https://react-supabase.vercel.app/documentation/data/use-select
  const [{ data: languages }] = useSelect('languages')

  return <div>
    {!user ? <Link to="/login">log in</Link> : <Link to="/account">Account</Link>}
    {languages && languages.length > 0 && languages.map(d => d.flag).join(' ')}
  </div>
}
