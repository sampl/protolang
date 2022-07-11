import { useUser } from "./user";
import { useSelect } from 'react-supabase'

export default function AccountDropdown() {

  const { user } = useUser();

  // https://react-supabase.vercel.app/documentation/data/use-select
  const [{ data: languages }] = useSelect('languages')

  return <div>
    {!user ? <a href="/login">log in</a> : <a href="/account">Account</a>}
    {languages && languages.length > 0 && languages.map(d => d.flag).join(' ')}
  </div>
}
