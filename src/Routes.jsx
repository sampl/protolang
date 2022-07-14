import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'

import Settings from '@/settings/Settings'
import Home from '@/home/Home'
import Resources from '@/resources/Resources'
import ResourceItem from '@/resources/ResourceItem'
import Lessons from '@/lessons/Lessons'
import LessonItem from '@/lessons/LessonItem'
import Practice from '@/practice/Practice'
import WordItem from '@/words/WordItem'
import Login from '@/account/login'
import Logout from '@/account/logout'

import Layout from '@/_layout/Layout'
import { useUser } from '@/_state/user'
import NewUserLanguage from '@/user_languages/NewUserLanguage'
import { useLanguage } from '@/_state/language'

const routes = [
  {
    path: `/`,
    component: Home,
    layout: Layout,
  },
  {
    path: `/settings`,
    component: Settings,
    layout: Layout,
    private: true,
  },
  {
    path: `/resources`,
    component: Resources,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/resources/:id`,
    component: ResourceItem,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/lessons`,
    component: Lessons,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/lessons/:id`,
    component: LessonItem,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/practice`,
    component: Practice,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/words/:id`,
    component: WordItem,
    layout: Layout,
    requires_language: true,
  },
  {
    path: `/login`,
    component: Login,
    layout: Layout,
  },
  {
    path: `/logout`,
    component: Logout,
    layout: Layout,
  },
]

export default () => {
  const { user } = useUser()
  const { currentLanguageId } = useLanguage()

  return <RouterRoutes>
    {routes.map(route => {
      return <Route
        key={route.path}
        path={route.path}
        element={
          <route.layout>
            {
              (route.private && !user) ?
              <Navigate to='/login' replace={true} /> :
              (route.requires_language && !currentLanguageId) ?
              <NewUserLanguage /> :
              <route.component />
            }
          </route.layout>
        }
      />
    })}
  </RouterRoutes>
}

