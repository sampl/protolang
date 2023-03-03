import { OneCol } from '@/styles/Layout'
import LessonsDownload from '../lessons/LessonsDownload'
import MnemonicsDownload from '../lessons/MnemonicsDownload'
import PhrasesDownload from '../practice/PhrasesDownload'

export default () => {
  return <OneCol>
    <h1>Open source</h1>
    <p>This project would not be possible without the open-source, community-driven projects it is built on. We are proud to offer our own work under free software licenses.</p>

    <h2>Application source code</h2>
    <p>The Protolang web app is available under the GPL.</p>
    <ul>
      <li>
        <a href="https://github.com/sampl/protolang">Browse source on Github</a> (coming soon)
      </li>
      <li>
        <a href="https://github.com/sampl/protolang/blob/main/license.txt">View license on Github</a> (coming soon)
      </li>
    </ul>

    <h2>Data downloads</h2>
    <p>User-generated content is available to download here. All of this content is free to use under a Creative Commons license (coming soon).</p>
    <ul>
      <li>
        <LessonsDownload />
      </li>
      <li>
        <PhrasesDownload />
      </li>
      <li>
        <MnemonicsDownload />
      </li>
    </ul>

    <h2>Attribution</h2>
    <p>Protolang depends on <a href="https://github.com/sampl/protolang/network/dependencies" target="_blank">this open source software</a>.</p>

  </OneCol>
}
