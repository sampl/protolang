import { useState } from 'react'
import styled from 'styled-components/macro'

import { useReferencePanel } from '@/_state/reference'
// import { useLanguage } from '@/_state/language'
// import {supabaseDictionaries} from '@/_util/supabaseClient'

export default () => {
  const { query, setQuery, setMode, setReferenceIsOpen } = useReferencePanel()

  // TODO - full text search suggestions
  // const { currentLanguage } = useLanguage()
  // https://supabase.com/docs/guides/database/full-text-search
  // const { data, error } = await supabaseDictionaries
  //   .from(currentLanguage.id)
  //   .select()
  //   .textSearch('fts', `'${string}'`)
  // }

  // console.log('query is', query)

  const onSubmit = async event => {
    event.preventDefault()
    setQuery(query)
    setReferenceIsOpen(true)
  }

  return <SearchForm onSubmit={onSubmit}>
    <SearchInput
      lang="it"
      type="search"
      placeholder="Search"
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  </SearchForm>
}

const SearchForm = styled.form`
  display: inline-block;
  width: 100%;
  padding: 1rem;
`
const SearchInput = styled.input`
  width: 100%;
  border-radius: 100px;
  box-shadow: inset 1px 1px;
  padding: 0.5rem 1rem;
  margin: 0;
`
