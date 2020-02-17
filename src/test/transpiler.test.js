import transpile from '../transpiler'
import interpreter from '../interpreter'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import '../styles.css'
import testString from './transpiler.txt'

let codeBefore = CodeMirror(null, {
  value: testString,
  lineNumbers: true,
  mode: 'javascript'
})

let codeAfter = CodeMirror(null, {
  lineNumbers: true,
  mode: 'javascript'
})

const transpileWorker = e => {
  let value = codeBefore.getValue()
  let transpiled = transpile(value)
  codeAfter.setValue(transpiled)
  interpreter(transpiled)
}

transpileWorker()
codeBefore.on('change', transpileWorker)

// dom
let container = document.createElement('div')
container.classList.add('container')
document.body.appendChild(container)
container.appendChild(codeBefore.display.wrapper)
container.appendChild(codeAfter.display.wrapper)

/*render(
  <div class="container">
    <codeBefore.display.wrapper />
    <codeAfter.display.wrapper />
  </div>,
  document.body
)*/

// cm refresh onmount
codeBefore.refresh()
codeAfter.refresh()
