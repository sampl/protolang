import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
// import {supabaseDictionaries} from '@/_util/supabaseClient'

export default () => {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()

  const [query, setQuery] = useState('')

  // TODO - full text search suggestions
  // https://supabase.com/docs/guides/database/full-text-search
  // const { data, error } = await supabaseDictionaries
  //   .from(currentLanguage.id)
  //   .select()
  //   .textSearch('fts', `'${string}'`)
  // }

  const onSubmit = async event => {
    event.preventDefault()
    navigate(`/it/dictionary/${encodeURIComponent(query)}`)
  }

  return <SearchForm onSubmit={onSubmit}>
    <SearchInput
      type="search"
      placeholder="Search"
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  </SearchForm>
}

const SearchForm = styled.form`
  display: inline-block;
`
const SearchInput = styled.input`
  margin: 0px;
  border: 1px solid;
`
