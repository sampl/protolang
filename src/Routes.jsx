import { Routes as RouterRoutes, Route } from 'react-router-dom'

import Account from './account/Account'
import Home from './Home'
import Resources from './resources/Resources'
import ResourceItem from './resources/ResourceItem'
import Lessons from './lessons/Lessons'
import LessonItem from './lessons/LessonItem'
import Login from './account/login'
import Logout from './account/logout'

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<Account />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceItem />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/lessons/:id" element={<LessonItem />} />

      {/* TODO - finish auth, also org folders */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
    </RouterRoutes>
  )
}
