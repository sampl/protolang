import { Link } from '@/styles/Links'

import { Panel } from '@/styles/Panels'
import { CheckboxGroup, RadioGroup } from '@/styles/RadioCheckbox'

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

    <Panel $dark $inset>Panel</Panel>
    <br />
    <Panel $dark $inset $grid>Grids</Panel>
    <br />
    <Panel $raised>Panel</Panel>
    <br />
    <Panel $dark $inset>
      <Panel $raised>Panel in a well</Panel>
    </Panel>
    <br />
    <Panel $raised>
      <Panel $dark $inset>Panel in a hump</Panel>
    </Panel>
    <br />
    <Panel $raised $roundedL>
      <Panel $screen $roundedM>Screen with bezel</Panel>
    </Panel>

    <h1>Heading 1</h1>
    <p>Paragraph text goes here. Lorem ipsum dolor sin amet.</p>

    <h2>Heading 2</h2>
    <p>Foo bar baz</p>
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

    <label>Select list (disabled)</label>
    <select disabled>
      <option>-- Choose an option --</option>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>

    <label>Checkboxes</label>
    <CheckboxGroup
      groupName="test"
      values={['1']}
      setValues={values => console.log('checkbox', values)}
      options={[
        {id: '1', description: 'Option 1'},
        {id: '2', description: 'Option 2'},
        {id: '3', description: 'Option 3'},
      ]}
    />

    <label>Radios</label>
    <RadioGroup
      value={'1'}
      setValue={value => console.log('radio', value)}
      options={[
        {id: '1', description: 'Option 1'},
        {id: '2', description: 'Option 2'},
        {id: '3', description: 'Option 3'},
      ]}
    />

    <br />

    <a href="https://github.com/sampl/protolang" target="_blank">External link</a>
    <br />
    <Link to="/">Internal link</Link>
    <br />
    <button onClick={ () => alert('You clicked it')}>Plain button</button>
    <br />
    <button className="button" onClick={ () => alert('You clicked it')}>Button with button class</button>
    <br />
    <Link to="/" className="button">Link as button</Link>
    <br />
    <button className="button" disabled onClick={ () => alert('Should not fire')}>Disabled button</button>
    <br />

    <br />
  </>
}
