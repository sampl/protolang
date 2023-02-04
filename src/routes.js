import Settings from '@/views/settings/Settings'
import Dashboard from '@/views/dashboard/Dashboard'
import Resources from '@/views/resources/Resources'
import ResourceItem from '@/views/resources/ResourceItem'
import Home from '@/views/marketing/Home'
import Lessons from '@/views/lessons/Lessons'
import LessonItem from '@/views/lessons/LessonItem'
import Practice from '@/views/practice/Practice'
import WordItem from '@/views/words/WordItem'
import Login from '@/views/account/Login'
import Logout from '@/views/account/Logout'
import FeedbackForm from '@/views/account/FeedbackForm'
import About from '@/views/marketing/About'
import Contribute from '@/views/marketing/Contribute'
import Sponsor from '@/views/marketing/Sponsor'

import LayoutSimple from '@/views/_layout/LayoutSimple'
import LayoutLanguage from '@/views/_layout/LayoutLanguage'
import LanguagePicker from '@/views/user_languages/LanguagePicker'
import Signup from '@/views/account/Signup'
import Contact from '@/views/marketing/Contact'
import Conduct from './views/marketing/Conduct'
import Legal from './views/marketing/Legal'
import ResourceNew from './views/resources/ResourceNew'
import OpenSource from './views/marketing/OpenSource'

// ROUTES
// This is a simple JS list of routes in the app
// Router.jsx consumes this and programmatically generates a list
// of react-router <Routes>

export default [

  // Marketing pages
  {
    path: `/`,
    component: Home,
    layout: LayoutSimple,
  },
  {
    path: `/about`,
    component: About,
    layout: LayoutSimple,
  },
  {
    path: `/contact`,
    component: Contact,
    layout: LayoutSimple,
  },
  {
    path: `/contribute`,
    component: Contribute,
    layout: LayoutSimple,
  },
  {
    path: `/conduct`,
    component: Conduct,
    layout: LayoutSimple,
  },
  {
    path: `/open-source`,
    component: OpenSource,
    layout: LayoutSimple,
  },
  {
    path: `/sponsor`,
    component: Sponsor,
    layout: LayoutSimple,
  },
  {
    path: `/legal`,
    component: Legal,
    layout: LayoutSimple,
  },

  // Account pages
  {
    path: `/settings`,
    component: Settings,
    layout: LayoutSimple,
    private_only: true,
  },
  {
    path: `/signup`,
    component: Signup,
    layout: LayoutSimple,
  },
  {
    path: `/login`,
    component: Login,
    layout: LayoutSimple,
  },
  {
    path: `/logout`,
    component: Logout,
    layout: LayoutSimple,
  },
  {
    path: `/feedback`,
    component: FeedbackForm,
    layout: LayoutSimple,
  },

  // Onboarding
  {
    path: `/languages`,
    component: LanguagePicker,
    layout: LayoutSimple,
  },

  // Normal language routes
  {
    path: `/:lang/resources`,
    component: Resources,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/resources/new`,
    component: ResourceNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/resources/:id`,
    component: ResourceItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/lessons`,
    component: Lessons,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/lessons/:slug`,
    component: LessonItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/practice`,
    component: Practice,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/words/:string`,
    component: WordItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang`,
    component: Dashboard,
    layout: LayoutLanguage,
  },
]
