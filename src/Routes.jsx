import { Routes as RouterRoutes, Route } from "react-router-dom";
import Account from "./Account";
import Home from "./Home";
import Resources from "./Resources";
import ResourceItem from './ResourceItem'
import Lessons from "./Lessons";
import LessonItem from './LessonItem'

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<Account />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceItem />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/lessons/:id" element={<LessonItem />} />
    </RouterRoutes>
  )
}
