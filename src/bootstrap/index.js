import { create, all } from 'mathjs';
const math = create(all);

class _BlockHandler {
  constructor(m) {
    console.error('ARGH')
    this.m = m
    m.disabled = true
    this.scope = this.m.scope
    this.r = {} //variables to be reverted
    this.d = [] //variable names to be deleted
  }

  eval(str, keyword) {
    // If disabled, immediatelly return encapsulating block's handler
    if (this.disabled) return this.m.eval(str)
    // before eval, get scope state
    let scopePrev = JSON.parse(JSON.stringify(this.m.scope))
    // eval
    let returnValue = this.m.eval(str)
    // After eval, get new scope state
    let scope = this.m.scope

    this.scopeWorker(scope, scopePrev, keyword, str, returnValue)
    return returnValue
  }

  closeBlock() {
    // revert variables
    Object.keys(this.r).forEach(key => (this.scope[key] = this.r[key]))
    // delete variables
    this.d.forEach(el => delete this.scope[el])
    this.m.disabled = false
    return this.m
  }

  newLine() {
    _line++
  }

  scopeWorker(scope, scopePrev, keyword, str, returnValue) {
    let LET = keyword === 'let'
    // Compare both {scope} and {scopePrev}
    Object.keys(scope).forEach(key => {
      if (scopePrev[key] === undefined) {
        if (!LET)
          console.warn(
            'WARNING in line ' + _line + '. Use "let" keyword before the expression \n"' + str + '".'
          )
        // if key is just defined
        this.d.push(key)
      } else if (scope[key] !== scopePrev[key]) {
        // if key is just redefined
        this.r[key] = scopePrev[key]
      }
    })
  }
}
let _line = 0
let _m = new _BlockHandler(new math.parser())
let _start = () => {
  _m = new _BlockHandler(_m)
}
let _end = () => {
  _m = _m.closeBlock()
}
let _ = (a, b, c) => _m.eval(a, b, c)
let _nl = () => {
  _m.newLine()
}
math.import(
  {
    print: el => {
      if (el._toString) el = el._toString()
      console.log(el)
    }
  },
  { override: true }
)


_start()
for (_(`j = 0`); _(`j < 5`); _(`j++`)) {
  _start()
  _start()
  while (_(`foo`)) {
    _start() /* multiline while block */
    _(`bar()`)
    _end()
  }
  _end()
  _start()
  while (_(`1000 m === 1 km`)) _(`bar()`)
  _end() /* one line while block */
  _end()
}
_end()
