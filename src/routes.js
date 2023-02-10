import Settings from '@/views/settings/Settings'
import Dashboard from '@/views/dashboard/Dashboard'
import Resources from '@/views/resources/Resources'
import ResourceItem from '@/views/resources/ResourceItem'
import Home from '@/views/marketing/Home'
import Lessons from '@/views/lessons/Lessons'
import LessonItem from '@/views/lessons/LessonItem'
import Practice from '@/views/practice/Practice'
import DictionaryItem from '@/views/dictionary/DictionaryItem'
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
import Terms from './views/legal/Terms'
import Privacy from './views/legal/Privacy'
import Dmca from './views/legal/Dmca'
import Conduct from './views/legal/Conduct'
import ResourceNew from './views/resources/ResourceNew'
import OpenSource from './views/marketing/OpenSource'
import Styleguide from './views/admin/Styleguide'
import MediaItem from './views/media/MediaItem'
import MediaNew from './views/media/MediaNew'
import Media from './views/media/Media'
import LessonNew from './views/lessons/LessonNew'
import LessonEdit from './views/lessons/LessonEdit'
import PhraseItem from './views/practice/PhraseItem'
import Dictionary from './views/dictionary/Dictionary'

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
    path: `/open-source`,
    component: OpenSource,
    layout: LayoutSimple,
  },
  {
    path: `/sponsor`,
    component: Sponsor,
    layout: LayoutSimple,
  },
  
  // Legal stuff
  {
    path: `/terms`,
    component: Terms,
    layout: LayoutSimple,
  },
  {
    path: `/privacy`,
    component: Privacy,
    layout: LayoutSimple,
  },
  {
    path: `/dmca`,
    component: Dmca,
    layout: LayoutSimple,
  },
  {
    path: `/conduct`,
    component: Conduct,
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
    path: `/:lang/media`,
    component: Media,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/media/new`,
    component: MediaNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/media/:id`,
    component: MediaItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/lessons`,
    component: Lessons,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/lessons/new`,
    component: LessonNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/lessons/:slug/edit`,
    component: LessonEdit,
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
    path: `/:lang/practice/:phraseId`,
    component: PhraseItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/dictionary`,
    component: Dictionary,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang/dictionary/:wordString`,
    component: DictionaryItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:lang`,
    component: Dashboard,
    layout: LayoutLanguage,
  },

  // Developers
  {
    path: `/styleguide`,
    component: Styleguide,
    layout: LayoutSimple,
  },
]
