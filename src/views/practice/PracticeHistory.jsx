import { useParams } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import AttemptsList from './AttemptsList'

export default () => {
  const { langId } = useParams()

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      Practice history
    </BreadcrumbWrapper>

    <h1>Practice history</h1>
    <AttemptsList />
  </>
}
