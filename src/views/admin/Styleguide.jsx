import { Link } from '@/styles/Links'

import Well from '@/styles/Well'
import Hump from '@/styles/Hump'

export default () => {

  return <>
    <h1>Style guide</h1>
    <p>
      Components for developers of the Protolang app.
    </p>
    <p>
      Not sure why you're here? Go back to the <Link to="/">homepage</Link>.
    </p>

    <hr />

    <Well>Well</Well>
    <br />
    <Hump>Hump</Hump>
    <br />
    <Well>
      <Hump>Hump in a well</Hump>
    </Well>
    <br />
    <Hump>
      <Well>Well in a hump</Well>
    </Hump>

    <h1>Heading 1</h1>
    <p>Paragraph text goes here. Lorem ipsum dolor sin amet.</p>
    <Link to="/">Link</Link>

    <h2>Heading 2</h2>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>

    <h3>Heading 3</h3>
    <ol>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ol>

    <hr />

    <label>Input label</label>
    <input />

    <label>Text area</label>
    <textarea />

    <label>Select list</label>
    <select>
      <option>-- Choose an option --</option>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>

    <br />

    <button>Button</button>

    <br />
  </>
}
