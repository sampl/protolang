import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'

import Settings from '@/views/settings/Settings'
import Home from '@/views/home/Home'
import Resources from '@/views/resources/Resources'
import ResourceItem from '@/views/resources/ResourceItem'
import Lessons from '@/views/lessons/Lessons'
import LessonItem from '@/views/lessons/LessonItem'
import Practice from '@/views/practice/Practice'
import WordItem from '@/views/words/WordItem'
import Login from '@/views/account/login'
import Logout from '@/views/account/logout'

import Layout from '@/views/_layout/Layout'
import { useUser } from '@/_state/user'
import NewUserLanguage from '@/views/user_languages/NewUserLanguage'
import { useLanguage } from '@/_state/language'

const routes = [
  {
    path: `/`,
    component: Home,
    layout: Layout,
    requires_language: true,
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
  const { currentLanguageId, currentLanguage } = useLanguage()

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
              (route.requires_language && !currentLanguage?.language?.is_live) ?
              `${currentLanguage.language?.name_en} coming soon!` :
              <route.component />
            }
          </route.layout>
        }
      />
    })}
  </RouterRoutes>
}

