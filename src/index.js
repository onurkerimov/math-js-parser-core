import testString from './test/transpiler.txt'

import tokenize from './tokenizer'
import lint from './linter'
import transpile from './transpiler'
import { createSandbox } from './sandbox'
import { katexPlugin } from './editor/katexPlugin'
import './styles.css'

// CodeMirror
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
import './linter/javascript-lint.js'
import 'codemirror/lib/codemirror.css'


// # Init CodeMirror instances
let codeBefore = CodeMirror(null, {
  value: testString,
  lineNumbers: true,
  mode: 'javascript',
  gutters: ["CodeMirror-lint-markers"],
  lint: true

})

let codeAfter = CodeMirror(null, {
  lineNumbers: true,
  mode: 'javascript',
  readOnly: true
})

// # Init katexPlugin, sandbox and the main process loop
//let plugin = katexPlugin({ editor: codeBefore })
let sandbox = createSandbox()

// Main function that runs after each modification
const process = () => {
  let value = codeBefore.getValue()
  let tokenizerResult = tokenize(value)
  let linterResult = lint(tokenizerResult)
  codeBefore.setValue(linterResult)
  //plugin.refresh(tokenizerResult)
  //sandbox.setCode(string)

}
process()
codeBefore.on('change', process)

// # Append to DOM
let app = document.querySelector('#app')
let container = document.createElement('div')
container.classList.add('container')
app.appendChild(container)
container.appendChild(codeBefore.display.wrapper)
container.appendChild(codeAfter.display.wrapper)
sandbox.mount(container)

// cm refresh onmount
codeBefore.refresh()
codeAfter.refresh()
