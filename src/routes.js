import Settings from '@/views/settings/Settings'
import Dashboard from '@/views/dashboard/Dashboard'
import ResourceList from '@/views/resources/ResourceList'
import ResourceItem from '@/views/resources/ResourceItem'
import Home from '@/views/marketing/Home'
import LessonList from '@/views/lessons/LessonList'
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
import LanguagePicker from '@/views/languages/LanguagePicker'
import Signup from '@/views/account/Signup'
import Contact from '@/views/marketing/Contact'
import Terms from './views/legal/Terms'
import Privacy from './views/legal/Privacy'
import Dmca from './views/legal/Dmca'
import Conduct from './views/legal/Conduct'
import ResourceNew from './views/resources/ResourceNew'
import ResourceEdit from './views/resources/ResourceEdit'
import OpenSource from './views/marketing/OpenSource'
import Styleguide from './views/admin/Styleguide'
import MediaItem from './views/media/MediaItem'
import MediaNew from './views/media/MediaNew'
import MediaEdit from './views/media/MediaEdit'
import MediaList from './views/media/MediaList'
import LessonNew from './views/lessons/LessonNew'
import LessonEdit from './views/lessons/LessonEdit'
import LessonHistory from './views/lessons/LessonHistory'
import LessonHistoryItem from './views/lessons/LessonHistoryItem'
import PhraseItem from './views/practice/PhraseItem'
import PhraseEdit from './views/practice/PhraseEdit'
import LayoutAdmin from './views/_layout/LayoutAdmin'
import AdminLessonEdits from './views/admin/AdminLessonEdits'
import AdminPhrases from './views/admin/AdminPhrases'
import AdminLanguages from './views/admin/AdminLanguages'
import AdminUsers from './views/admin/AdminUsers'
import AdminPhraseIssues from './views/admin/AdminPhraseIssues'
import AdminLessons from './views/admin/AdminLessons'
import Chat from './views/chat/Chat'
import PracticeHistory from './views/practice/PracticeHistory'

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

  // Resources
  {
    path: `/:langId/resources`,
    component: ResourceList,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/resources/new`,
    component: ResourceNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/resources/:resourceId/edit`,
    component: ResourceEdit,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/resources/:resourceId`,
    component: ResourceItem,
    layout: LayoutLanguage,
  },

  // Media
  {
    path: `/:langId/media`,
    component: MediaList,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/media/new`,
    component: MediaNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/media/:mediaId/edit`,
    component: MediaEdit,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/media/:mediaId`,
    component: MediaItem,
    layout: LayoutLanguage,
  },

  // Lessons
  {
    path: `/:langId/lessons`,
    component: LessonList,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/lessons/new`,
    component: LessonNew,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/lessons/:slug/edit`,
    component: LessonEdit,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/lessons/:slug/history`,
    component: LessonHistory,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/lessons/:slug/history/:editId`,
    component: LessonHistoryItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/lessons/:slug`,
    component: LessonItem,
    layout: LayoutLanguage,
  },

  // Practice
  {
    path: `/:langId/practice`,
    component: Practice,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/practice/history`,
    component: PracticeHistory,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/practice/:phraseId`,
    component: PhraseItem,
    layout: LayoutLanguage,
  },
  {
    path: `/:langId/practice/:phraseId/edit`,
    component: PhraseEdit,
    layout: LayoutLanguage,
  },

  // Chat
  {
    path: `/:langId/chat`,
    component: Chat,
    layout: LayoutLanguage,
  },

  // Dictionary
  {
    path: `/:langId/dictionary/:wordString`,
    component: DictionaryItem,
    layout: LayoutLanguage,
  },

  // Admin
  {
    path: `/:langId/admin`,
    component: AdminLessons,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/lessons`,
    component: AdminLessons,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/lesson-edits`,
    component: AdminLessonEdits,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/phrases`,
    component: AdminPhrases,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/phrase-issues`,
    component: AdminPhraseIssues,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/languages`,
    component: AdminLanguages,
    layout: LayoutAdmin,
  },
  {
    path: `/:langId/admin/users`,
    component: AdminUsers,
    layout: LayoutAdmin,
  },
  
  // Developers
  {
    path: `/styleguide`,
    component: Styleguide,
    layout: LayoutAdmin,
  },

  // Language dashboard
  {
    path: `/:langId`,
    component: Dashboard,
    layout: LayoutLanguage,
  },
]
