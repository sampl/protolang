import { OneCol } from "@/styles/Layout"
import { Link } from "react-router-dom"

export default () => {
  
  return <OneCol>

    <h1>About this site</h1>

    <p>
      Protolang is a free, open-source language learning website, similar to Duolingo or Rosetta Stone.
      The goal is to help language learners get to proficiency as fast as possible.
    </p>

    <p>
      Protolang includes:
    </p>
    <ul>
      <li>
        Lessons on vocabulary, grammar, pronunciation etc
      </li>
      <li>
        Audio flash cards with speech recognition to train and reenforce what you know
      </li>
    </ul>

    <p>
      Our approach is based on our concept of digital immersion: exposing learners to as much spoken language as quickly as possible.
    </p>

    <h2>So what's wrong with Duolingo?</h2>
    <p>
      Nothing is "wrong" with these apps—we don't think they're very effective at teaching languages.
    </p>

    <p>
      Here are some differences between Duolingo:
    </p>
    <ul>
      <li>
        Duolingo rewards with users with digital coins, gold, and status, but doesn't track your fluency
      </li>
      <li>
        Duolingo's animations cannot be turned off on iOS
      </li>
      <li>
        Duolingo's well-publicized "gameification" is designed to trick you into returning to the app—not help you gain fluency 
      </li>
      <li>
        Duolingo is also a publically-traded, for-profit company backed by venture capitalists with proprietary (ie not open) course content.
      </li>
    </ul>

    <p>
      If you're interested, read our blog post on <Link to="">the difference between Protolang and Duolingo</Link>.
    </p>

    <h2>What do you mean when you say this site is "free"?</h2>
    <p>
      This website is freely available to use at no cost to anyone in the world.
      {/* We've been inspired by lichess and other small-headcount open source free services. */}
    </p>

    <p>
      Improving and maintaining this site costs a significant amount of money and time. If you believe in our mission and you have the means to give, please consider becoming a sponsor.
    </p>

    {/* <p>
      Like Wikipedia, we prompt some of our users to consider donating, but these prompts are skippable. 
    </p> */}

    {/* <p>
      We may create new, paid add-ons in the future, but we will never sell the contributions of our contributors.
    </p> */}

    <h2>What do you mean by "open source"?</h2>
    <p>
      Unlike Duolingo and every other major learning app, the code and content of this website is freely available under a permissive <a href="https://en.wikipedia.org/wiki/Open-source_software">open-source license</a>.
    </p>
    <p>
      Learn more about the <a href="">licenses</a> we use, or browse/fork the the <a href="">source</a> yourself. of our web app is available on Github. The app is written in Next.js and React, with a Supabase Postgres backend (all of which are themselves open source). You can copy the code, run it on your own server, and contribute your own features back to the site. The source is covered under the GPL, which means that although you can use it and distribute it, you can't sell it or sell any software that uses it.
    </p>
    <p>
      The content of our lessons is also available on GitHub in markdown format. In theory, you could learn a language just by reading this text and never using the website at all! Lesson content is licensed with a creative Commons noncommercial share-alike like license, which again means that you can download, print, and share these lessons (as long as you don't sell them for commercial profit).
    </p>

    <h2>How can I help?</h2>
    We believe that
    <ul>
      <li>
        The world would be a better place if cultures could communicate with each other
      </li>
      <li>
        Learning new languages should be free (and open source)
      </li>
      <li>
        Digital, self-directed learning tools are key to the future of education
      </li>
    </ul>

    <p>
      As a project we believe in small teams, low budgets, and giving most things away for free.
    </p>

    <p>
      Read our <a href="">code of conduct</a>, contributor guidelines, licenses etc.
    </p>

    Software developers - build features, fix bugs in our React app with a Postgres backend. See our contributing.md.
    Multilinguists - develop new courses in new languages

    <p>
      We've tried to make it as easy as possible for new contributors to add their content.
      All contributions to our language lessons are licensed under our creative Commons license,
      which means your contributions will be made indefinitely available for free to everyone in the world ❤️
    </p>

    <p>
      If you believe in the mission and want to support server costs, you can also set up a subscription.
    </p>

    <h2>When will you add a course in [language x]?</h2>
    <p>
      Unfortunately I don't have the expertise to add more content without the help of community volunteers.
    </p>

    <p>
      If you or someone you know speaks a language besides English and you want to help build a course, learn about volunteering.
    </p>

    <h2>Why does the website look old?</h2>
    <p>
      Unlike many modern websites, this app has a lot of text on every page. Believe it or not, we designed it this way on purpose!
    </p>

    <ul>
      <li>
        This density is in service to our philosophy of "digital immersion", giving you as much of a language to hear, read, and absorb as quickly as possible.
      </li>
      <li>
        It also supports our value of accessibility. System fonts and low fidelity images make our site fast to load for anyone in the world.
      </li>
      <li>
        Stylistically, we have to admit we were inspired by retro "world traveller" and retro technology aesthetics. Learn more about our design philosophy at this blog post.
      </li>
    </ul>

    <p>
      At some point we may make things feel a little more modern. In the meantime, the app is open source, so you can self-host and edit the styles.
    </p>

    <h2>Who made this?</h2>
    <p>
      Sam Pierce Lolla created the website with the help of our open-source contributors. The content is developed by our language volunteers with support from our sponsors—thank you!
    </p>

    <Link to="/contact">Contact</Link>

  </OneCol>
}
