import { Routes as RouterRoutes, Route } from "react-router-dom";
import Account from "./Account";
import Home from "./Home";

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<Account />} />
    </RouterRoutes>
  )
}
