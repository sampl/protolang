import AccountDropdown from "./AccountDropdown";
import { Link } from "react-router-dom";

export default function Layout({children}) {
  return <div>
    <header>
      <nav>
        <a href="/">Home</a>
        <Link to="/lessons">Lessons</Link>
        <Link to="/resources">Resources</Link>

        <AccountDropdown />
      </nav>
    </header>
    <hr />
    <main>
      {children}
    </main>
  </div>
}
