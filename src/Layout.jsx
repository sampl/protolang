import AccountDropdown from "./AccountDropdown";

export default function Layout({children}) {
  return <div>
    <header>
      <nav>
        <a href="/">Home</a>
        {/* <Link href="/lessons">Lessons</Link> */}
        {/* <Link href="/practice">Practice</Link> */}
        {/* <Link href="/resources">Resources</Link> */}

        <AccountDropdown />
      </nav>
    </header>
    <hr />
    <main>
      {children}
    </main>
  </div>
}
