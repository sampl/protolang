import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import routes from '@/routes'
import redirects from '@/redirects'
import ErrorPage from '@/views/ErrorPage'
import LayoutSimple from './views/_layout/LayoutSimple'

export default () => {
  const { user } = useUser()
  
  return <RouterRoutes>
    {routes.map(route => {      
      return <Route
        key={route.path}
        path={route.path}
        element={
          <route.layout>
              {
                // if you must be logged in for this route
                (route.private_only && !user) ?
                <Navigate to='/login' replace={true} /> :
                <route.component />
              }
            </route.layout>
          }
      />
    })}

    {redirects.map(redirect => {      
      return <Route
        key={redirect.path}
        path={redirect.path}
        element={ <Navigate to={redirect.target} /> }
      />
    })}

    <Route
      key="*"
      path="*"
      element={
        <LayoutSimple>
          <ErrorPage />
        </LayoutSimple>
      }
    />

  </RouterRoutes>
}
