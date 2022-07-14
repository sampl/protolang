import { Routes as RouterRoutes, Route } from 'react-router-dom'

import Account from '@/account/Account'
import Home from '@/Home'
import Resources from '@/resources/Resources'
import ResourceItem from '@/resources/ResourceItem'
import Lessons from '@/lessons/Lessons'
import LessonItem from '@/lessons/LessonItem'
import Practice from '@/practice/Practice'
import Deck from '@/practice/Deck'
import WordItem from '@/words/WordItem'
import Login from '@/account/login'
import Logout from '@/account/logout'

import Layout from './_layout/Layout'

const routes = [
  {
    path: `/`,
    component: Home,
    layout: Layout,
  },
  {
    path: `/account`,
    component: Account,
    layout: Layout,
  },
  {
    path: `/resources`,
    component: Resources,
    layout: Layout,
  },
  {
    path: `/resources/:id`,
    component: ResourceItem,
    layout: Layout,
  },
  {
    path: `/lessons`,
    component: Lessons,
    layout: Layout,
  },
  {
    path: `/lessons/:id`,
    component: LessonItem,
    layout: Layout,
  },
  {
    path: `/practice`,
    component: Practice,
    layout: Layout,
  },
  {
    path: `/practice/deck/:id`,
    component: Deck,
    layout: Layout,
  },
  {
    path: `/words/:id`,
    component: WordItem,
    layout: Layout,
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
  return (
    <RouterRoutes>
      {
        routes.map(route => {
          return <Route
            key={route.path}
            path={route.path}
            element={
              <route.layout>
                <route.component />
              </route.layout>
            }
          />
        })
      }
    </RouterRoutes>
  )
}
