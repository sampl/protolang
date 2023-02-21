import { useParams } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import AttemptsList from './AttemptsList'

export default () => {
  const { langId } = useParams()

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/practice/history`}>Practice history</BreadcrumbItem>
    </BreadcrumbWrapper>

    <h1>Practice history</h1>
    <AttemptsList />
  </>
}
