import { OneCol } from "@/styles/Layout"
import { Link } from "react-router-dom"

export default () => {
  return <OneCol>

    <h1>About this site</h1>

    <p>
      Protolang is a free, open-source language learning website, similar to Duolingo or Rosetta Stone.
      The goal is to help language learners get to proficiency as fast as possible.
    </p>

    <p>We believe that:</p>

    <ul>
      <li>
        The world would be a better place if cultures could communicate with each other
      </li>
      <li>
        It is imperative that we preserve the world's diverse languages for future generations
      </li>
      <li>
        Learning new things online should be free
      </li>
      <li>
        Digital, self-directed learning tools are key to the future of education
      </li>
      <li>
        Small teams of passionate people can build amazing things
      </li>
    </ul>

    <h2>So what's wrong with Duolingo?</h2>
    <p>
      Nothing is "wrong" with other apps. We just don't think they're very effective at teaching languages.
    </p>

    <p>
      Here are some other differences between Protolang and Duolingo:
    </p>
    <ul>
      <li>
        Duolingo has a very narrow learning path for learners, while Protolang offers lots of learning tools and lets you choose your own path.
      </li>
      <li>
        Duolingo rewards with users with fake prizes like digital coins, "gold", and status, while Protolang is focused on getting you to practical fluency.
      </li>
      <li>
        Duolingo is a publicly-traded, for-profit company backed by venture capitalists with proprietary, closed source course content.
      </li>
    </ul>

    {/* <p>
      If you're interested, read our blog post on <Link to="">the difference between Protolang and Duolingo</Link>.
    </p> */}

    <h2>What do you mean when you say this site is "free"?</h2>
    <p>
      This website is free to use at no cost to anyone in the world.
    </p>
    <p>
      We may create a premium set of paid features in the future to help support the site, but the core experience will stay free the contributions of our contributors will stay free under our <a href="/open-source">open licenses</a>.
    </p>
    <p>
      Improving and maintaining this site costs money and time. If you believe in our mission and you have the means to give, please <a href="/sponsor">consider becoming a sponsor</a>.
    </p>

    <h2>What do you mean by "open source"?</h2>
    <p>
      Unlike Duolingo (and every other major learning app), all the source code of this website is freely available under a permissive <a href="https://en.wikipedia.org/wiki/Open-source_software">open-source license</a>. That means you can copy the code, run it on for free your own computer, and contribute your own features back to the site.
    </p>
    <p>
      The content of our lessons is also open source, which means you can download, print, and share these lessons for free (as long as you don't sell them for commercial profit). In theory, you could learn a language just by reading our lesson text and never use the website at all.
    </p>
    <p>
      Learn more about the <a href="/open-source">open source licenses we use</a>, or browse/fork the the <a href="https://github.com/sampl/protolang">source</a> yourself.
    </p>

    <h2>How can I help?</h2>
    <p>
      We are actively looking for multi-lingual volunteers, people with language teaching experience, and software developers to help build this site.
    </p>
    <p>
      All of your contributions are released under the same <a href="/open-source">open licenses</a>, which means they will be made indefinitely available for free to everyone in the world.
    </p>
    <p>
      Read our <a href="/contributing">contributor guidelines</a> to learn how to get started.
    </p>
    <p>
      If you believe in the mission and want to support server costs, you can also <a href="/sponsor">sponsor the project</a>.
    </p>

    <h2>When will you add my target language?</h2>
    <p>
      Because we are an open-source app, we need expertise from volunteers to add more languages.
    </p>
    <p>
      If you (or someone you know) speaks a language besides English and you want to help build a course, learn how to start by reading our <a href="/contributing">contributing guidelines</a>.
    </p>

    <h2>Why does the website look old?</h2>
    <p>
      While Protolang is in active early development, we're focusing on making it useful before we make it pretty. Stay tuned for style updates.
    </p>

    <h2>Who made this?</h2>
    <p>
      The Protolang app and website is built and maintained by our <a href="https://github.com/sampl/protolang/graphs/contributors">open-source contributors</a>.
      {/* Our lesson content is developed by our language volunteers with support from our sponsors—thank you! */}
    </p>

    <h2>I have a question that's not answered here</h2>
    Please <Link to="/contact">contact us</Link>, we would love to hear from you.

  </OneCol>
}
